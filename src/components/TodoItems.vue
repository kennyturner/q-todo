<template>
  <q-list>
    <q-expansion-item
        v-for="task in props.tasks"
        :key="task.id"
        expand-icon="mdi-chevron-down"
        popup
        group="somegroup"
    >
        <template v-slot:header>
            <q-item-section avatar>
                <q-btn flat icon="mdi-dots-vertical" @click.stop>
                    <q-menu
                        transition-show="flip-right"
                        transition-hide="flip-left"
                        anchor="center left"
                        cover
                        auto-close
                    >
                    <q-list style="min-width: 150px">
                        <q-item clickable>
                            <q-item-section @click="emit('toggleStatus', task.id)">
                                <span  v-if="task.done">Mark Incomplete</span>
                                <span v-else>Mark Complete</span>
                            </q-item-section>
                        </q-item>
                        <q-item clickable>
                            <q-item-section @click="emit('editTask', task.id)">Edit Task</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable>
                            <q-item-section @click="emit('removeTask', task.id)">Delete Task</q-item-section>
                        </q-item>
                    </q-list>
                    </q-menu>
                </q-btn>
          </q-item-section>
          <q-item-section :top="!!task.dueDate">
            <div>{{ task.title }}</div>
            <small v-if="!!task.dueDate">Due: {{ new Date(task.dueDate).toLocaleDateString() }}</small>
          </q-item-section>
        </template>

                <q-card>
                    <q-card-section>
                        <p v-if="task.content">
                        {{ task.content}}
                        </p>
                        <p v-else>
                            <em>No notes for this task</em>
                        </p>
                    </q-card-section>
                </q-card>
    </q-expansion-item>
    <q-item v-if="props.tasks.length === 0">
        <q-item-section class="text-center">
            <em>
                <slot name="no-data">No tasks</slot>
            </em>
        </q-item-section>
    </q-item>
</q-list>
</template>

<script setup>
import { defineProps, defineEmit } from "vue";

const props = defineProps({
    tasks: {
        type: Array,
        default: () => ([])
    }
})

const emit = defineEmit(["removeTask", "editTask", "toggleStatus"])
</script>
