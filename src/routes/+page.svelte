<script lang="ts">
    import { db } from '$lib/firebase';
    import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

    let { data } = $props();
    let posts = $derived(data.posts);
    let user = $derived(data.user);

    let content = $state('');
    let submitting = $state(false);

    async function submit() {
        if (!$user || !content.trim()) return;
        submitting = true;
        await addDoc(collection(db, 'posts'), {
            uid: $user.uid,
            name: $user.displayName ?? $user.email,
            content: content.trim(),
            createdAt: serverTimestamp()
        });
        content = '';
        submitting = false;
    }

    async function deletePost(id: string) {
        await deleteDoc(doc(db, 'posts', id));
    }

    function timeAgo(iso: string | null) {
        if (!iso) return '';
        const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        return new Date(iso).toLocaleDateString();
    }
</script>

<!-- Compose -->
{#if $user}
    <div class="border-b border-gray-800 p-4">
        <div class="flex gap-3">
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white"
            >
                {($user.displayName ?? $user.email ?? '?')[0].toUpperCase()}
            </div>
            <div class="flex flex-1 flex-col gap-3">
                <textarea
                    class="min-h-20 resize-none bg-transparent text-lg outline-none placeholder:text-gray-600"
                    placeholder="What is happening?!"
                    bind:value={content}
                ></textarea>
                <div class="flex justify-end">
                    <button
                        onclick={submit}
                        disabled={submitting || !content.trim()}
                        class="rounded-full bg-sky-500 px-5 py-1.5 text-sm font-bold transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >{submitting ? 'Posting...' : 'Post'}</button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}

<!-- Feed -->
{#if $posts.length === 0}
    <div class="p-8 text-center text-gray-500">No posts yet. Be the first!</div>
{:else}
    {#each $posts as post (post.id)}
        <div
            class="border-b border-gray-800 p-4 transition hover:bg-white/2 {post.pending
                ? 'opacity-50'
                : ''}"
        >
            <div class="flex gap-3">
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white"
                >
                    {post.name[0].toUpperCase()}
                </div>
                <div class="flex flex-1 flex-col gap-1">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="font-bold">{post.name}</span>
                            <span class="text-sm text-gray-500">· {timeAgo(post.createdAt)}</span>
                        </div>
                        {#if $user?.uid === post.uid}
                            <button
                                onclick={() => deletePost(post.id)}
                                class="text-xs text-gray-600 transition hover:text-red-500"
                                >Delete</button
                            >
                        {/if}
                    </div>
                    <p class="leading-relaxed">{post.content}</p>
                </div>
            </div>
        </div>
    {/each}
{/if}
