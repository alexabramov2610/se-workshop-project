import React, {useEffect, useState} from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import TableRow from "./table-row/table-row.components";
import TableHeader from "./table-header/table-header.component";
import {DiscountPageCtx} from "../../pages/discount-page/discount-page-ctx";
import {Empty} from "antd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const Rows = React.memo(function Rows({discounts}) {
    return discounts.map((discount, index) => {
        return <TableRow discount={discount} index={index} key={discount.key}/>;
    });
});

function DiscountsSummery() {

    function onDragEnd(result, props) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const policy = reorder(
            props.policyDiscounts,
            result.source.index,
            result.destination.index
        );

        props.setPolicyDiscounts(policy);
    }

    return (
        <DiscountPageCtx.Consumer>
            {
                props => <div style={{height: "65vh", overflowY: "scroll"}}>
                    <DragDropContext onDragEnd={(result) => onDragEnd(result, props)}>
                        <TableHeader/>
                        <Droppable droppableId="list">
                            {provided => (
                                props.policyDiscounts.length === 0
                                    ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                    : <div ref={provided.innerRef} {...provided.droppableProps}>
                                        <Rows discounts={props.policyDiscounts}/>
                                        {provided.placeholder}
                                    </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

            }
        </DiscountPageCtx.Consumer>
    )
}

export default DiscountsSummery;
