import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SkillsClient from "./SkillsClient";

const AVAILABLE_SKILLS = ["JavaScript", "Python", "React", "Data Structures"];

export default async function SkillsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    // Get user ID from session
    const userId = (session.user as any).id || "demo-user";

    return <SkillsClient userId={userId} availableSkills={AVAILABLE_SKILLS} />;
}
