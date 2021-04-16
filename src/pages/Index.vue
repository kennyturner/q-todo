<template>
    <q-header elevated class="bg-dark q-pa-sm">
        <div class="text-center text-h6">Task Manager</div>
        <q-input
            round
            label-color="white"
            color="grey-2"
            filled
            v-model="newTask"
            @keydown.enter="addTask"
            class="q-mb-sm"
            bg-color="grey-8"
            clearable
            standout
            dark
        >
            <template #append>
                <q-btn flat @click="addTask" round icon="mdi-playlist-plus" color="grey-2" />
            </template>
        </q-input>
    </q-header>

    <q-footer elevated>
        <q-tabs v-model="tab" align="justify" class="bg-dark">
            <q-tab name="incomplete" label="Incomplete" />
            <q-tab name="complete" label="Complete" />
        </q-tabs>
    </q-footer>

    <q-page padding>
        <q-tab-panels
            v-model="tab"
            animated
            transition-prev="fade"
            transition-next="fade"
        >
            <q-tab-panel name="incomplete">
                <TodoItems :tasks="incompleteTasks" @removeTask="removeTask" @editTask="editTask" @toggleStatus="toggleStatus">
                    <template #no-data>No Incomplete Tasks</template>
                </TodoItems>
            </q-tab-panel>

            <q-tab-panel name="complete">
                <TodoItems :tasks="completeTasks" @removeTask="removeTask" @editTask="editTask" @toggleStatus="toggleStatus">
                    <template #no-data>No Complete Tasks</template>
                </TodoItems>
            </q-tab-panel>
        </q-tab-panels>

        <q-dialog v-model="prompt" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">Update Task {{ currentTaskObject.title }}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input
                        label="Title"
                        dense
                        v-model="currentTaskObject.title"
                        autofocus
                        class="q-mb-md"
                        clearable
                    />

                    <q-input
                        type="textarea"
                        label="Content"
                        dense
                        v-model="currentTaskObject.content"
                        class="q-mb-md"
                        clearable
                        autogrow
                    />

                    <q-input filled :modelValue="currentTaskObject.dueDate" mask="date" :rules="['date']" readonly>
                        <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                    <q-date v-model="currentTaskObject.dueDate">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Close" color="primary" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>

                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Close" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { Notify, LocalStorage } from "quasar";
import TodoItems from "../components/TodoItems";

const currentTask = ref(null);
const newTask = ref("");
const tab = ref("incomplete");


let savedTasks = LocalStorage.getItem("tasks");
if (!savedTasks) savedTasks = [];
const tasks = ref(savedTasks);

const currentTaskObject = computed(() => {
    if (!currentTask.value && currentTask.value !== 0) return {};
    else return tasks.value[currentTask.value];
})

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
}

const addTask = (param) => {
    if (!newTask.value) {
        Notify.create({
            message: "Please add a task content",
            color: "negative",
            icon: "mdi-alert-circle",
        });
        return false;
    }
    tasks.value.push({
        id: generateId(),
        title: newTask.value,
        content:'',
        dueDate:'',
        createdDate: Date.now(),
        done: false,
    });
    newTask.value = "";
    tab.value="incomplete"
};

const removeTask = (id) => {
    console.log(id);
    const index = tasks.value.findIndex((t) => t.id === id);
    console.log(index);
    tasks.value.splice(index, 1);
    Notify.create({
        message: "Task was removed",
        color: "positive",
        icon: "mdi-thumb-up",
    });
};

const editTask = (id) => {
    const index = tasks.value.findIndex((t) => t.id === id);
    prompt.value = true;
    currentTask.value = index;
    // Notify.create({
    //     message: "Task was updated",
    //     color: "positive",
    //     icon: "mdi-thumb-up",
    // });
};

const toggleStatus = (id) => {
    const index = tasks.value.findIndex((t) => t.id === id);
    tasks.value[index].done = !tasks.value[index].done;
}

watch(tasks.value, () => {
    LocalStorage.set("tasks", tasks.value);
});

const incompleteTasks = computed(() => {
    return tasks.value.filter((t) => t.done === false);
});
const completeTasks = computed(() => {
    return tasks.value.filter((t) => t.done === true);
});

const prompt = ref(false);
</script>
