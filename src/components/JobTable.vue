<template>
  <div>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
      no-data-label="No Past Jobs! Start A New One"
      :rows-per-page-options="[0]"
      flat
      bordered
    >
      <template #top>
        <div class="text-subtitle1 text-weight-medium">Past Jobs</div>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  setup() {
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
    const rows = [
      {
        id: "abc123",
        name: "Chen-Kang Lee",
        date: Date(2024, 2, 17),
      },
    ];

    return {
      columns,
      rows,
    };
  },
};
</script>
