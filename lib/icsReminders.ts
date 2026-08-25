// Calendar-reminder fallback for the web build.
//
// The plan: expo-notifications on the web only fires while the tab is
// open, which defeats the point of a reminder. Rather than wire up FCM
// Web / a service worker for launch, we let users export their three
// daily practice reminders (Rise / Reset / Rest) as a .ics file that
// they can open in Google Calendar, Apple Calendar, Outlook, or any
// other RFC-5545-compliant client. Those apps then own the actual
// notifying, which they're much better at than a browser tab.
//
// Native builds don't need this — the OS scheduler handles it via
// expo-notifications. This module is web-only in intent; the generator
// itself is pure JS and can run anywhere.

import type { HabitLinkConfig } from '../contexts/SettingsContext';
import {
    NOTIFICATION_COPY,
    bodyFor,
    type NotificationPeriod,
} from '../content/notifications';

interface HabitLinksLike {
    morning: HabitLinkConfig;
    midday: HabitLinkConfig;
    evening: HabitLinkConfig;
}

// Parse "8:30 AM" or legacy "14:30" into {h, m}. Returns null on garbage.
function parseTime(s: string): { h: number; m: number } | null {
    if (!s) return null;
    const trimmed = s.trim();

    if (!trimmed.includes('AM') && !trimmed.includes('PM')) {
        const [h, m] = trimmed.split(':').map(Number);
        if (Number.isNaN(h) || Number.isNaN(m)) return null;
        return { h, m };
    }

    const [time, modifier] = trimmed.split(' ');
    const parts = time.split(':').map(Number);
    let h = parts[0];
    const m = parts[1];
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    return { h, m };
}

const pad = (n: number) => String(n).padStart(2, '0');

// "YYYYMMDD" from a Date's UTC components.
function ymdUtc(d: Date): string {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

// "YYYYMMDD" from a Date's local components (for floating-time DTSTART).
function ymdLocal(d: Date): string {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

// "YYYYMMDDTHHMMSSZ" — RFC-5545 UTC timestamp for DTSTAMP.
function utcStamp(d: Date): string {
    return `${ymdUtc(d)}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

// Escape a text field per RFC 5545 §3.3.11.
function escapeText(s: string): string {
    return s
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

// UTF-8 encoded length of a single code point.
function utf8Length(codePoint: number): number {
    if (codePoint < 0x80) return 1;
    if (codePoint < 0x800) return 2;
    if (codePoint < 0x10000) return 3;
    return 4;
}

// Fold long lines per RFC 5545 §3.1: the octet (byte) count of any line
// must be at most 75, and each continuation line begins with a single
// space (that leading space itself counts toward the 75). Code-unit-only
// slicing would (a) let a mostly-multibyte string exceed 75 bytes while
// staying under 75 JS characters — some strict clients (Outlook,
// libical) reject that — and (b) can split a surrogate pair, mangling
// the character. So iterate code points (via for..of, which yields whole
// code points) and fold at code-point boundaries once the running byte
// count would exceed the octet budget for the current line.
function foldLine(line: string): string {
    const OCTET_LIMIT = 75;
    // Continuation lines lose 1 octet to the leading space marker.
    const CONT_LIMIT = 74;

    // Fast path: pure ASCII short enough to stay under the limit as-is.
    let ascii = true;
    for (let i = 0; i < line.length; i++) {
        if (line.charCodeAt(i) > 0x7F) { ascii = false; break; }
    }
    if (ascii && line.length <= OCTET_LIMIT) return line;

    const chunks: string[] = [];
    let current = '';
    let currentBytes = 0;
    let limit = OCTET_LIMIT;

    for (const cp of line) {
        const bytes = utf8Length(cp.codePointAt(0)!);
        if (currentBytes + bytes > limit && current.length > 0) {
            chunks.push(current);
            current = '';
            currentBytes = 0;
            limit = CONT_LIMIT;
        }
        current += cp;
        currentBytes += bytes;
    }
    if (current.length > 0) chunks.push(current);
    return chunks.join('\r\n ');
}

function buildEvent(
    uid: string,
    now: Date,
    firstDay: Date,
    period: NotificationPeriod,
    h: number,
    m: number,
    link: HabitLinkConfig,
    sequence: number,
): string {
    // Floating local time (no TZ suffix). Per RFC 5545 §3.3.5, this
    // means "fires at the user's local wall-clock time no matter which
    // timezone they're in that morning" — exactly what a daily practice
    // reminder should do. If we stamped a specific TZ, a user who flies
    // to a new one would get their 8am reminder at 5am.
    const start = `${ymdLocal(firstDay)}T${pad(h)}${pad(m)}00`;
    const title = NOTIFICATION_COPY[period].title;
    const body = bodyFor(period, link.relation, link.anchor);

    return [
        'BEGIN:VEVENT',
        foldLine(`UID:${uid}`),
        foldLine(`DTSTAMP:${utcStamp(now)}`),
        // RFC 5545 §3.8.7.4 SEQUENCE: strictly-increasing revision
        // counter. Clients that apply revision semantics use it to
        // decide whether a re-imported UID is a newer version of the
        // existing event (SEQUENCE went up = replace) or a duplicate
        // to ignore (SEQUENCE unchanged = keep the old one). Omitting
        // it is treated as SEQUENCE:0, so every re-export would look
        // identical and users who change reminder times would see
        // strict clients (Outlook, some corporate mail apps) silently
        // keep the old times. Passing the Unix-second timestamp gives
        // every export a monotonically increasing sequence with no
        // client-side state; occasional no-op re-exports still bump
        // it, which is harmless.
        `SEQUENCE:${sequence}`,
        foldLine(`DTSTART:${start}`),
        'DURATION:PT3M',
        'RRULE:FREQ=DAILY',
        foldLine(`SUMMARY:${escapeText(title)}`),
        foldLine(`DESCRIPTION:${escapeText(body)}`),
        // Simple DISPLAY alarm fires at event start. Users can turn
        // this into a push in their calendar app's own settings.
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        foldLine(`DESCRIPTION:${escapeText(title)}`),
        'TRIGGER:-PT0M',
        'END:VALARM',
        'END:VEVENT',
    ].join('\r\n');
}

/**
 * Build a .ics calendar payload with up to three daily recurring
 * reminders (Rise / Reset / Rest) at the times the user chose in
 * onboarding. Returns null if no period is enabled with a valid time.
 *
 * `ownerId` is folded into the event UID so re-importing the file
 * updates the same events instead of duplicating them (per RFC 5545,
 * calendar clients treat a matching UID as the same event).
 */
export function buildRemindersIcs(
    habitLinks: HabitLinksLike,
    opts?: {
        calendarName?: string;
        ownerId?: string | null;
        // Snooze end time as a millisecond epoch, or null/undefined if
        // reminders are not snoozed. When set and in the future, the
        // first occurrence of each event is advanced day-by-day until
        // its local wall-clock start is strictly after this instant, so
        // an "All Day" snooze the user picked in Settings doesn't fire
        // an exported reminder during the paused window.
        snoozeUntilMs?: number | null;
    },
): string | null {
    const now = new Date();
    const snoozeMs = opts?.snoozeUntilMs ?? null;
    const snoozeActive = snoozeMs !== null && snoozeMs > now.getTime();
    // Unix-second timestamp is the sequence number for every VEVENT in
    // this build. Same value across all three (Rise/Reset/Rest) events
    // in one export — RFC 5545 tracks SEQUENCE per UID, and every UID
    // here is unique per (owner, period), so parallel numbering is
    // fine. A later re-export will always yield a larger value.
    const sequence = Math.floor(now.getTime() / 1000);

    const periods: NotificationPeriod[] = ['morning', 'midday', 'evening'];
    const events: string[] = [];
    const ownerId = opts?.ownerId || 'guest';

    for (const p of periods) {
        const link = habitLinks[p];
        if (!link?.enabled || !link.time) continue;
        const parsed = parseTime(link.time);
        if (!parsed) continue;

        // Pick the first day this event should fire. Default = today at
        // the chosen hour:minute. If a snooze is active, advance the
        // day-of-month until the event's local wall-clock start is
        // strictly past the snooze end. Bounded loop as a guard against
        // pathological snoozeUntil values.
        const firstDay = new Date();
        firstDay.setHours(parsed.h, parsed.m, 0, 0);
        if (snoozeActive) {
            let guard = 0;
            while (firstDay.getTime() <= snoozeMs! && guard < 366) {
                firstDay.setDate(firstDay.getDate() + 1);
                guard++;
            }
        }

        // UID is stable per (owner, period) so re-importing replaces
        // rather than duplicates.
        const uid = `be333-${p}-${ownerId}@be333.app`;
        events.push(buildEvent(uid, now, firstDay, p, parsed.h, parsed.m, link, sequence));
    }

    if (events.length === 0) return null;

    const name = opts?.calendarName || 'BE333 Reminders';

    return (
        [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//BE333//Reminders//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            foldLine(`X-WR-CALNAME:${escapeText(name)}`),
            // Blank X-WR-TIMEZONE keeps the events on floating time.
            'X-WR-TIMEZONE:',
            ...events,
            'END:VCALENDAR',
        ].join('\r\n') + '\r\n'
    );
}

/**
 * Trigger a browser download of an .ics payload as a file. Web-only;
 * no-op on native (native uses the OS scheduler via expo-notifications
 * and doesn't need this fallback). Returns true on success, false on
 * failure or non-web environment.
 */
export function downloadIcsWeb(ics: string, filename = 'be333-reminders.ics'): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    try {
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        // Some browsers require the element to be in the DOM before .click().
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Small delay before revoking so the download actually starts.
        setTimeout(() => URL.revokeObjectURL(url), 200);
        return true;
    } catch (e) {
        console.warn('Reminder .ics download failed:', e);
        return false;
    }
}
