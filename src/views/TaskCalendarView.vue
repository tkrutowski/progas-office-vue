<template>
    <div>
        <Menu />
        <TaskCalendar/>
    </div>
</template>

<script>
    import Menu from "@/components/Menu";
    import TaskCalendar from "@/components/tasks/TaskCalendar";

    export default {
        name: "TASKTaskCalendar",
        components: {
          TaskCalendar,
            Menu,
        }
    }
</script>

<style scoped>

</style>