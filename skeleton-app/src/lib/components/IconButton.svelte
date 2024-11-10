<script lang="ts">
  import Icon from "@iconify/svelte";

  export let icon: string;
  export let label: string = "";
  export let cButton: string = "";
  export let disabled: boolean = false;
  export let onClick: () => void;
</script>

<button type="button" class="btn variant-filled {cButton}" on:click={onClick} {disabled}>
  <div class="w-5 h-5">
    <Icon {icon} class="w-full h-full" />
  </div>
  {#if label}
    <span>{label}</span>
  {/if}
</button>
