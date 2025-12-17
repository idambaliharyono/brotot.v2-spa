<script lang="ts">
    const { title, template } = $props<{ 
        title: string;
        template: string; }>()
    
</script>
<nav class="w-full flex justify-between items-center
        bg-black backdrop-blur-2xl border-b-black sticky top-0 z-50">
    <h1 class="font-bold font-family-primary p-4 text-2xl">{title}</h1>
    <div class="flex gap-2">

    </div>
</nav>