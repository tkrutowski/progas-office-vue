<template>
    <div>
        <Menu />
        <AddWorkTime/>
    </div>
</template>

<script>
    import Menu from "@/components/Menu";
    import AddWorkTime from "@/components/hr/AddWorkTime";

    export default {
        name: "HrAddWorkTime",
        components: {
            AddWorkTime,
            Menu,
        }
    }
</script>

<style scoped>

</style>