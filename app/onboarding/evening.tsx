import { HabitLinkBuilder } from '../../components/HabitLinkBuilder';

export default function EveningLink() {
    return (
        <HabitLinkBuilder
            period="evening"
            title="🌙 Relax"
            description="Unwind and let go before sleep."
            suggestions={[
                "Turn on TV",
                "Do laundry",
                "Have dessert",
                "Feed my pet",
                "Shower"
            ]}
            nextRoute="/onboarding/review"
            isFinal={true}
        />
    );
}
