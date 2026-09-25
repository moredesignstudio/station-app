import { radius, shadow, surface } from '@getstation/theme';
import * as React from 'react';
import { DragLayer } from 'react-dnd';
import SubdockItem from './SubdockItem';

interface Props {
  dragType: string,
  item: {
    application: { id: string },
    item: { title: string },
  },
  itemType: string,
  initialOffset: { x: number, y: number },
  currentOffset: { x: number, y: number },
  isDragging: boolean,
}

const layerStyles = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 999999,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(props: Props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    };
  }

  const transform = `translate(${currentOffset.x}px, ${currentOffset.y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
    backgroundColor: surface.elevated,
    width: 280,
    borderRadius: radius.md,
    boxShadow: shadow.panel,
  };
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
export default class SubdockItemDragLayer extends React.PureComponent<Props> {
  render() {
    const { item, isDragging, itemType, dragType } = this.props;
    if (itemType !== dragType) {
      return null;
    }
    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <ul style={getItemStyles(this.props)}>
          <SubdockItem
            application={item.application}
            item={item.item}
          />
        </ul>
      </div>
    );
  }
}
