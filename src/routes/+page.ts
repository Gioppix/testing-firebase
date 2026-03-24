import { readable } from 'svelte/store';
import { db } from '$lib/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export function load() {
    const posts = readable<
        {
            id: string;
            name: string;
            content: string;
            createdAt: string | null;
            pending: boolean;
        }[]
    >([], (set) => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            set(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    content: doc.data().content,
                    createdAt: doc.data().createdAt?.toDate().toISOString() ?? null,
                    pending: doc.metadata.hasPendingWrites
                }))
            );
        });
    });

    return { posts };
}
