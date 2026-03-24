import { readable } from 'svelte/store';
import { db } from '$lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export function load({ params }: { params: { username: string } }) {
    const username = decodeURIComponent(params.username);

    const profile = readable<{ uid: string; bio: string; displayName: string } | null>(
        null,
        (set) => {
            const q = query(collection(db, 'users'), where('displayName', '==', username));
            return onSnapshot(q, (snap) => {
                if (!snap.empty) {
                    const d = snap.docs[0];
                    set({ uid: d.id, bio: d.data().bio ?? '', displayName: d.data().displayName });
                } else {
                    set({ uid: '', bio: '', displayName: username });
                }
            });
        }
    );

    const posts = readable<
        {
            id: string;
            uid: string;
            name: string;
            content: string;
            createdAt: string | null;
            pending: boolean;
        }[]
    >([], (set) => {
        const q = query(collection(db, 'posts'), where('name', '==', username));
        return onSnapshot(q, (snap) => {
            set(
                snap.docs
                    .map((d) => ({
                        id: d.id,
                        uid: d.data().uid,
                        name: d.data().name,
                        content: d.data().content,
                        createdAt: d.data().createdAt?.toDate().toISOString() ?? null,
                        pending: d.metadata.hasPendingWrites
                    }))
                    .sort((a, b) => {
                        if (!a.createdAt && !b.createdAt) return 0;
                        if (!a.createdAt) return 1;
                        if (!b.createdAt) return -1;
                        return b.createdAt > a.createdAt ? -1 : 1;
                    })
            );
        });
    });

    return { profile, posts, username };
}
