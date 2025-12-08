import { HabitLinkBuilder } from '../../components/HabitLinkBuilder';

export default function MorningLink() {
    return (
        <HabitLinkBuilder
            period="morning"
            title="☀️ Rise"
            description="Start your day with intention. Choose a habit you do every morning."
            suggestions={[
                "Use restroom",
                "Feed my pet",
                "Shower",
                "Drink water",
                "Start work"
            ]}
            nextRoute="/onboarding/midday"
        />
    );
}
