# Private instance with configurable registration modes

The installation is private by default — authentication required everywhere, no anonymous Catalog browsing. New accounts are always **Listeners** until a Curator grants ingest or publish permissions. Registration mode is configurable: `admin-only`, `invite` (default), or `open` (opt-in for LAN/homelab). We chose private-first because self-hosted music servers exposed via reverse proxy are a common abuse surface, and curator permissions are more sensitive than listener access.

**Considered options:** open registration by default (rejected — conflicts with household security posture); admin-only forever (rejected — too rigid for friends-and-family signup when invite links suffice).
