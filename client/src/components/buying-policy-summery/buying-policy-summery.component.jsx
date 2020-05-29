import React from 'react';
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import TableHeader from "./table-header/table-header.component";
import {Empty} from "antd";
import TableRow from "./table-row/table-row.component";

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

function BuyingPolicySummery() {

    function onDragEnd(result) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const policy = reorder(
            [],
            result.source.index,
            result.destination.index
        );

        // props.setPolicyDiscounts(policy);
    }

    return (
        <div style={{height: "60vh", overflowY: "scroll"}}>
            <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                <TableHeader/>
                <Droppable droppableId="list">
                    {provided => (
                        [].length === 0
                            ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                            : <div ref={provided.innerRef} {...provided.droppableProps}>
                                <Rows discounts={[]}/>
                                {provided.placeholder}
                            </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default BuyingPolicySummery;
