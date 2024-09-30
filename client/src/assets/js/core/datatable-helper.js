const defaultDatatableConfig = {
    destroy: true,
    processing: true,
    filter: true,
    orderMulti: false,
    serverSide: true,
    language: {
        sLengthMenu: 'Show _MENU_',
        search: '',
        searchPlaceholder: 'Search...',
    },
    lengthMenu: [ [5, 50, 100, 500, 1000, -1], [5, 50, 100, 500, 1000] ],
    ajax: {
        contentType: 'application/json',
        datatype: 'json',
        headers: {
            authorization: `Bearer ${token}`
        },
        error: (err) => {
            ToastMsg(err.responseJSON.error.message, 'Error')
        },
    },
};

const initiateDatatable = ({
    tableId,
    ajaxConfig,
    columns,
    sorting = 0,
    dom = constant.DATATABLE.DOM,
    buttons = [],
    columnDefs,
    responsive,
    sortType = 'desc',
    initComplete = null,
    ordering = true,
    search = true,
    pageLength = 50
}) => {
    const datatableConfig = {
        ...defaultDatatableConfig,
        search,
        ordering,
        pageLength,
        dom,
        buttons,
        columnDefs,
        order: [[sorting, sortType]],
        responsive,
        ajax: {
            ...defaultDatatableConfig.ajax,
            url: ajaxConfig.url,
            type: ajaxConfig.type,
        },
        columns,
        initComplete,
    };

    return $(`#${tableId}`).DataTable(datatableConfig);
};
