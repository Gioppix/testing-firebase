import { readable } from 'svelte/store';
import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

export function load() {
    const user = readable<User | null>(null, (set) => {
        return onAuthStateChanged(auth, set);
    });

    return { user };
}
