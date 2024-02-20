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
    >
      <template #top>
        <div class="text-subtitle1 text-weight-medium">Past Jobs</div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { toRefs } from "vue";

export default {
  props: ["rows"],
  emits: ["row-click"],
  setup(props, { emit }) {
    const columns = [
      {
        name: "id",
        label: "ID",
        align: "left",
        field: (row) => row.id,
        sortable: false,
      },
      {
        name: "name",
        label: "Name",
        align: "left",
        field: (row) => row.name,
        sortable: false,
      },
      {
        name: "date",
        label: "Date Created",
        sortable: true,
        align: "left",
        field: (row) => row.date,
      },
    ];
    const { rows } = toRefs(props);

    const rowClick = (evnt, row, idx) => {
      emit("row-click", row);
    };

    return {
      columns,
      rows,
      rowClick,
    };
  },
};
</script>
