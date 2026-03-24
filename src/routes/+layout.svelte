<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.svg';
    import { auth } from '$lib/firebase';
    import { signOut } from 'firebase/auth';
    import { page } from '$app/stores';
    import { resolve } from '$app/paths';

    let { data, children } = $props();
    let user = $derived(data.user);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-black text-white">
    <div class="mx-auto max-w-xl border-x border-gray-800">
        <div class="sticky top-0 z-10 border-b border-gray-800 bg-black/80 px-4 backdrop-blur">
            <div class="flex h-14 items-center justify-between">
                <a href={resolve('/')} class="text-xl font-bold">Home</a>
                {#if $user}
                    <div class="flex items-center gap-3">
                        <a
                            href={resolve(`/user/[username]`, {
                                username: encodeURIComponent($user.displayName ?? $user.email ?? '')
                            })}
                            class="text-sm text-gray-400 transition hover:text-white"
                            >{$user.displayName ?? $user.email}</a
                        >
                        <button
                            onclick={() => signOut(auth)}
                            class="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400 transition hover:border-red-500 hover:text-red-500"
                            >Sign out</button
                        >
                    </div>
                {:else if $page.url.pathname !== '/login'}
                    <a
                        href={resolve('/login')}
                        class="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-bold transition hover:bg-sky-400"
                        >Sign in</a
                    >
                {/if}
            </div>
        </div>

        {@render children()}
    </div>
</div>
