import React from "react";

import {Box} from '@mui/material';

interface Props {
    items: Number[]
    nCol?: Number
}

export default function ItemBox({items, nCol}: Props) {
    items.sort().reverse();
    const nItems = items.length;
    let colFormat = "";
    for (let i = 0; i < (nCol ? nCol : 3); i++) {
        colFormat += "auto "
    }
    return (
        <Box sx={{display: 'grid', gridTemplateColumns: colFormat, rowGap: .3, columnGap: .4}}>
            {
                [...Array(6)].map((v, i) => {
                    return (
                        i < nItems && items[i] > 0 ?
                            <Box sx={{p: 0, height: '25px'}}><img src={`/images/items/${items[i]}.png`}
                                                                  alt={`/images/items/${items[i]}.png`}
                                                                  style={{height: '25px'}}/></Box> :
                            <Box sx={{p: 0, height: '25px', width: '25px', bgcolor: '#b7b7b74f'}}/>
                    )
                })
            }
        </Box>
    )
}