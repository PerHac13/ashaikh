import { useState, useEffect } from "react";

const useActiveSection = (sectionIds: string[]): string => {
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(()=> {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        },
        {
            threshold: 0.9,
        });

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });
        return ()=> observer.disconnect();

    }, [sectionIds]);

    return activeSection;
};

export default useActiveSection;