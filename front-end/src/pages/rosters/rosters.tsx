import { Box, Container, Hidden, SelectChangeEvent, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SeasonModel from "../../../../Common/models/season.model";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import { GetAllSeasons } from "../../api/season";
import RisenSeasonSelector from "../../components/selectors/risen-season-selector";

export default function Rosters() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [seasonId, setSeasonId] = useState<string>("RISEN");
    const [seasons, setSeasons] = useState<SeasonModel[]>([]);
    const [roleId, setRoleId] = useState<GameRoles>(GameRoles.ALL);
    useEffect(() => {
        GetAllSeasons().then(allSeasons => {
            setSeasons(allSeasons.seasons);
        });
    }, []);

    return (
        <Container maxWidth='lg' sx={{ pt: 10, minHeight: '100vh', color: theme.palette.info.light }}>
            <Box>
                <Hidden mdDown>
                    <Typography fontFamily="Montserrat" variant="h1" color={theme.palette.info.light}>
                        TOP PLAYERS
                    </Typography>
                </Hidden>
                <Hidden lgUp>
                    <Typography fontFamily="Montserrat" variant="h3" color={theme.palette.info.light}>
                        TOP PLAYERS
                    </Typography>
                </Hidden>
            </Box>
            <hr />
            <Box sx={{ display: 'flex', columnGap: 2, flexWrap: 'wrap' }}>
                <RisenSeasonSelector
                    callBack={(event: SelectChangeEvent) => { setSeasonId(event.target.value) }}
                    sx={{ minWidth: '200px', pt: 1, pb: 1 }}
                    seasonConfig={{seasonId, setSeasonId, seasons}}
                    hideAllGames={true} />
            </Box>
        </Container>
    )
}