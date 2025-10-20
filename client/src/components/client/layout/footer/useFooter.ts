'use client';

import { useState } from 'react';

export function useFooter() {
    const [mobileMenus, setMobileMenus] = useState<string[]>([]);
    const [email, setEmail] = useState('');

    const toggleMobileMenu = (title: string) => {
        setMobileMenus((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const handleSubscribe = () => {
        // TODO: Implement newsletter subscription
        console.log('Subscribe:', email);
        setEmail('');
    };

    return {
        mobileMenus,
        email,
        setEmail,
        toggleMobileMenu,
        handleSubscribe,
    };
}
