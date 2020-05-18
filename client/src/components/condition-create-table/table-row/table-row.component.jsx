import React from 'react';
import {Table} from "semantic-ui-react";
import SearchSelect from "../../search-select/search-select.component";

const DiscountCreationTableRow = ({products}) => {
    return (
        <Table.Row>
            <Table.Cell>NOTHING</Table.Cell>
            <Table.Cell>Approved</Table.Cell>
            <Table.Cell>None</Table.Cell>
        </Table.Row>
    );
}

export default DiscountCreationTableRow;