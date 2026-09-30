import * as React from 'react';

/**
 * SVG filters for the rail, rendered once. Inactive apps use the duotone:
 * greyscale mapped from midnight (#100D1E) to milk (#F8F9FA).
 */
export const RAIL_DUOTONE_FILTER_ID = 'rail-duotone';

const RailFilters = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden={true} focusable={false}>
    <filter id={RAIL_DUOTONE_FILTER_ID} colorInterpolationFilters="sRGB">
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.063 0.973" />
        <feFuncG type="table" tableValues="0.051 0.976" />
        <feFuncB type="table" tableValues="0.118 0.98" />
      </feComponentTransfer>
    </filter>
  </svg>
);

export default RailFilters;
