import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GameRoles } from "../../../../Common/Interface/General/gameEnums";
import SeasonModel from "../../../../Common/models/season.model";
import { GetActiveSeasons } from "../../api/season";
import { GetSeasonPlayersStatsSheet } from "../../api/statExport";
import { SaveBlob } from "../../common/utils";
import GamesFilter from "../../components/filters/games-filter";
import LoadingButton from "../../components/loading-button/LoadingButton";

export default function SeasonPlayersSheet() {
  const [loading, setLoading] = useState(false);
  const [seasonId, setSeasonId] = useState("RISEN");
  const [roleId, setRoleId] = useState<GameRoles>(GameRoles.ALL);
  const [seasons, setSeasons] = useState<SeasonModel[]>([]);

  const seasonConfig = {
    seasonId,
    setSeasonId,
    seasons,
  };

  const roleConfig = {
    roleId: roleId,
    setRoleId,
  };

  useEffect(() => {
    GetActiveSeasons().then(seasonData => {
      setSeasons(seasonData.seasons);
    })
  }, []);

  const handleClick = async () => {
    setLoading(true);
    const data = await GetSeasonPlayersStatsSheet(seasonId, roleId);

    SaveBlob(data, "text.csv");
    setLoading(false);
  };

  return (
    <Box>
      <Box>
        <Typography variant="h2" sx={{pb: 1}}>
          Champion Stats Export
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Box sx={{ pr: 2}}>
          <GamesFilter sx={{mb: 2}} useSeason={true} seasonConfig={seasonConfig} useRole={true} roleConfig={roleConfig} hideAllGames={true} />
        </Box>
        <LoadingButton variant='outlined' sx={{width: '250px'}} onClick={handleClick} loading={loading}>
          Download
        </LoadingButton>
      </Box>
    </Box>
  )
}