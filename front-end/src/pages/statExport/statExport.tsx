import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, useTheme} from "@mui/material";
import {Container} from "@mui/system";
import React, {useState} from "react";
import {TabPanel} from "../../components/tab-panel/tab-panel";
import BasicSheetExport from "./basicSheet";
import ChampionSheetExport from "./championSheet";
import SeasonPlayersSheet from "./seasonPlayersSheet";

export default function StatExport() {
    const theme = useTheme();
    const [exportItem, setExportItem] = useState<number>(1);

    const handleChange = (event: SelectChangeEvent) => {
        setExportItem(Number.parseInt(event.target.value));
    };
    return (
        <Container sx={{pt: 10, minHeight: '100vh', color: theme.palette.info.light}}>
            <Box>
                <Typography variant="h1" color={theme.palette.info.light}>
                    Stat Exporting
                </Typography>
            </Box>
            <hr></hr>
            <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
                <Box>
                    <Typography>
                        Please select the type of stats that you want to export from the options below
                    </Typography>
                    <ol>
                        <li>
                            <Typography textAlign="left">
                                Player Averages: Exports a CSV of the specified Player's average game data.
                            </Typography>
                        </li>
                        <li>
                            <Typography textAlign="left">
                                Champion Sheet: Exports a CSV champion data for the specified season.
                            </Typography>
                        </li>
                        <li>
                            <Typography textAlign="left">
                                Season Players: Exports a CSV for player average game data filtered by season and
                                optionally role.
                            </Typography>
                        </li>
                    </ol>
                </Box>
                <hr></hr>
                <Box>
                    <FormControl sx={{minWidth: '300px'}}>
                        <InputLabel id="demo-simple-select-label">Export Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={exportItem.toString()}
                            label="Export Type"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>Player Averages</MenuItem>
                            <MenuItem value={2}>Champion Sheet</MenuItem>
                            <MenuItem value={3}>Season Players</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <hr></hr>
            <TabPanel value={exportItem} index={1}>
                <BasicSheetExport></BasicSheetExport>
            </TabPanel>
            <TabPanel value={exportItem} index={2}>
                <ChampionSheetExport/>
            </TabPanel>
            <TabPanel value={exportItem} index={3}>
                <SeasonPlayersSheet/>
            </TabPanel>
        </Container>
    )
}