<template>
  <div>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
      no-data-label="No past jobs! Start a new one"
      :rows-per-page-options="[0]"
      flat
      bordered
      @row-click="rowClick"
      :pagination="pagenation"
    >
      <template #top>
        <div class="text-subtitle1 text-weight-medium">Past Jobs</div>
      </template>
      <template #body-cell-status="props">
        <q-td :props="props">
          <div class="status-column">
            <template v-if="props.value === 'done'">
              <q-badge color="positive" text-color="white" label="Done" />
            </template>
            <template v-if="props.value === 'processing'">
              <q-badge color="amber-6" text-color="white" label="Processing">
                <q-spinner-dots
                  color="bg-amber-6"
                  class="q-px-xs"
                  size="1.3em"
                />
              </q-badge>
            </template>
            <template v-if="props.value === 'error'">
              <q-badge color="red" text-color="white" label="Error" />
            </template>
          </div>
        </q-td>
      </template>
      <template #header-cell-name="props">
        <q-th :props="props">
          <div class="name-column">{{ props.col.label }}</div>
        </q-th>
      </template>
      <template #body-cell-delete="props">
        <q-td :props="props">
          <q-btn
            flat
            color="red"
            icon="highlight_off"
            @click.stop="rowDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { toRefs, defineComponent, PropType } from "vue";
import { Job } from "../types";

export default defineComponent({
  props: {
    rows: {
      type: Object as PropType<Array<Job>>,
    },
  },
  emits: ["row-click", "row-delete"],
  setup(props, { emit }) {
    const columns = [
      {
        name: "name",
        label: "Name",
        align: "left",
        field: (row: Job) => row.name,
        sortable: false,
      },
      {
        name: "date",
        label: "Date Created",
        sortable: true,
        align: "left",
        field: (row: Job) => row.date,
      },
      {
        name: "status",
        label: "Status",
        sortable: true,
        align: "left",
        field: (row: Job) => row.status,
        classes: "ca-table",
      },
      { name: "delete", label: "", field: "", align: "center" },
    ];
    const { rows } = toRefs(props);

    const rowClick = (_event: Event, row: Job, _idx: number) => {
      emit("row-click", row);
    };

    const rowDelete = (row: Job) => {
      emit("row-delete", row);
    };

    return {
      columns,
      rows,
      rowClick,
      rowDelete,
      pagenation: {
        sortBy: "date",
        descending: true,
        rowsPerPage: 10,
      },
    };
  },
});
</script>
