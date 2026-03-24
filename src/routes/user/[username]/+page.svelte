<script lang="ts">
    import { db } from '$lib/firebase';
    import { doc, setDoc, deleteDoc } from 'firebase/firestore';

    let { data } = $props();
    let user = $derived(data.user);
    let profile = $derived(data.profile);
    let posts = $derived(data.posts);
    let username = $derived(data.username);

    let isOwner = $derived(!!$user && $user.displayName === username);

    let editingBio = $state(false);
    let bioValue = $state('');

    $effect(() => {
        if ($profile && !editingBio) bioValue = $profile.bio ?? '';
    });

    async function saveBio() {
        if (!$user) return;
        const trimmed = bioValue.trim();
        if (trimmed === ($profile?.bio ?? '')) {
            editingBio = false;
            return;
        }
        await setDoc(
            doc(db, 'users', $user.uid),
            { displayName: $user.displayName, bio: trimmed },
            { merge: true }
        );
        editingBio = false;
    }

    function onBioKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            bioValue = $profile?.bio ?? '';
            editingBio = false;
        }
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            saveBio();
        }
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

<!-- Profile header -->
<div class="border-b border-gray-800 p-6">
    <div class="flex items-center gap-4">
        <div
            class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sky-500 text-2xl font-bold text-white"
        >
            {username[0].toUpperCase()}
        </div>
        <div>
            <h1 class="text-xl font-bold">{username}</h1>
            <p class="text-sm text-gray-500">{$posts.length} posts</p>
        </div>
    </div>

    <!-- Bio -->
    <div class="mt-4">
        {#if editingBio}
            <textarea
                class="w-full resize-none bg-transparent text-gray-300 outline-none placeholder:text-gray-600"
                rows="3"
                placeholder="Write a bio..."
                bind:value={bioValue}
                onblur={saveBio}
                onkeydown={onBioKeydown}
            ></textarea>
            <p class="mt-1 text-xs text-gray-600">Blur or ⌘↵ to save · Esc to cancel</p>
        {:else if isOwner}
            <button
                class="w-full cursor-text text-left text-gray-300 transition hover:text-white"
                onclick={() => (editingBio = true)}
            >
                {#if $profile?.bio}
                    {$profile.bio}
                {:else}
                    <span class="text-gray-600 italic">No bio.</span>
                {/if}
            </button>
        {:else}
            <p class={$profile?.bio ? 'text-gray-300' : 'text-gray-600 italic'}>
                {$profile?.bio || 'No bio.'}
            </p>
        {/if}
    </div>
</div>

<!-- Posts -->
{#if $posts.length === 0}
    <div class="p-8 text-center text-gray-500">No posts yet.</div>
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
