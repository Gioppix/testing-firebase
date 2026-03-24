<script lang="ts">
    import { resolve } from '$app/paths';
    import { timeAgo } from '$lib/utils';
    import type { Post } from '$lib/types';

    let {
        post,
        currentUserId,
        onDelete
    }: {
        post: Post;
        currentUserId: string | null | undefined;
        onDelete: (id: string) => void;
    } = $props();
</script>

<div
    class="border-b border-gray-800 p-4 transition hover:bg-white/2 {post.pending
        ? 'opacity-50'
        : ''}"
>
    <div class="flex gap-3">
        <a
            href={resolve(`/user/[username]`, { username: encodeURIComponent(post.name) })}
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white transition hover:opacity-80"
        >
            {post.name[0].toUpperCase()}
        </a>
        <div class="flex flex-1 flex-col gap-1">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <a
                        href={resolve(`/user/[username]`, {
                            username: encodeURIComponent(post.name)
                        })}
                        class="font-bold transition hover:underline">{post.name}</a
                    >
                    <span class="text-sm text-gray-500">· {timeAgo(post.createdAt)}</span>
                </div>
                {#if currentUserId === post.uid}
                    <button
                        onclick={() => onDelete(post.id)}
                        class="text-xs text-gray-600 transition hover:text-red-500">Delete</button
                    >
                {/if}
            </div>
            <p class="leading-relaxed">{post.content}</p>
        </div>
    </div>
</div>
