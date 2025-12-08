import { HabitLinkBuilder } from '../../components/HabitLinkBuilder';

export default function MiddayLink() {
    return (
        <HabitLinkBuilder
            period="midday"
            title="🌤️ Rest"
            description="Take a pause in the middle of the noise."
            suggestions={[
                "Eat lunch",
                "Drink water",
                "Use restroom",
                "Start work"
            ]}
            nextRoute="/onboarding/evening"
        />
    );
}
