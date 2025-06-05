<script lang="ts">
	import {Player} from '@/features/player/components';
	import {PlaybackContext} from '@/features/playback/contexts';
	import { page } from '$app/state';

  const { children } = $props();

	const isHome = $derived(page.url.pathname === '/player');
	const isBrowse = $derived(page.url.pathname === '/context');
	const isLibrary = $derived(page.url.pathname === '/library');
	const isSearch = $derived(page.url.pathname === '/search');
</script>

<PlaybackContext>
	<div data-layout>
		<main data-layout-area="content">
			{@render children()}
		</main>

		<Player data-layout-area="player" />

		<nav data-layout-area="navigation" aria-label="Main Menu">
			<ul>
				<li aria-current={isHome ? 'page' : undefined}>
					<a href="/player" class:active={isHome}>
						<i aria-hidden="true" class:outlined={!isHome}>home</i>
						<span>Home</span>
					</a>
				</li>
				<li aria-current={isBrowse ? 'page' : undefined}>
					<a href="/context" class:active={isBrowse}>
						<i aria-hidden="true" class:outlined={!isBrowse}>explore</i>
						<span>Browse</span>
					</a>
				</li>
				<li aria-current={isLibrary ? 'page' : undefined}>
					<a href="/library" class:active={isLibrary}>
						<i aria-hidden="true" class:outlined={!isLibrary}>library_music</i>
						<span>Library</span>
					</a>
				</li>
				<li aria-current={isSearch ? 'page' : undefined}>
					<a href="/search" class:active={isSearch}>
						<i aria-hidden="true" class:outlined={!isSearch}>search</i>
						<span>Search</span>
					</a>
				</li>
			</ul>
		</nav>
	</div>
</PlaybackContext>
