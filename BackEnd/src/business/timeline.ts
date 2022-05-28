import { TimelineParticipantStats } from "../../../Common/Interface/Database/timeline";
import { RiotTimelineDto, RiotTimelineParticipantFrameDataDto, RiotTimelineParticipantFrameDto } from "../../../Common/Interface/RiotAPI/RiotApiDto";
import { RiotTimelineEvent, RiotTimelineEventChampionKillDto } from "../../../Common/Interface/RiotAPI/RiotApiTimelineEvents";
import * as utils from '../../../Common/utils';

function DefaultTimelineStats(): TimelineParticipantStats
{
  return {
    kills15: 0,
    killMap: [],

    deaths15: 0,
    deathMap: [],

    wardsPlaced15: 0,
    wardsKilled15: 0,

    assists15: 0,
    assistMap: [],

    goldMap: [],
    xpMap: [],
    csMap: []
  } as TimelineParticipantStats;
}

export function ProcessTimeline(timeline: RiotTimelineDto) : TimelineParticipantStats[]
{
  let allParticipants: TimelineParticipantStats[] = [];
  for (let i = 0; i < 10; i++)
  {
    allParticipants.push(DefaultTimelineStats());
  }

  let timelineInfo = timeline.info;
  for (let frame of timelineInfo.frames)
  {
    ProcessEvents(allParticipants, frame.events);
    ProcessParticipantFrames(allParticipants, frame.participantFrames);
  }

  return allParticipants;
}

function IsPre15(timestamp: number): boolean
{
  return utils.riotTimestampToMinutes(timestamp) < 15;
}

function ProcessEvents(allParticipants: TimelineParticipantStats[], events: RiotTimelineEvent[])
{
  for (let event of events)
  {
    if (utils.EventIsWardKill(event) && IsPre15(event.timestamp))
    {
      let id = event.killerId-1;
      if (id < 0 || id >= 10)
      {
        console.log("Invalid killer id: " + id);
        continue;
      }
      allParticipants[id].wardsKilled15 += 1;
    }
    else if (utils.EventIsWardPlaced(event) && IsPre15(event.timestamp))
    {
      let id = event.creatorId-1;
      if (id < 0 || id >= 10)
      {
        console.log("Invalid killer id: " + id);
        continue;
      }
      allParticipants[id].wardsPlaced15 += 1;
    }
    else if (utils.EventIsChampionKill(event) && IsPre15(event.timestamp))
    {
      HandleChampionKill(allParticipants, event);
    }
  }
}


function HandleChampionKill(allParticipants: TimelineParticipantStats[], event: RiotTimelineEventChampionKillDto)
{
  let id = event.killerId-1;
  if (id < 0 || id >= 10)
  {
    console.log("Invalid killer id: " + id);
    return;
  }
  let pre15 = IsPre15(event.timestamp);

  // Handle kill
  if (pre15)
  {
    allParticipants[id].kills15 += 1;
  }
  allParticipants[id].killMap.push([event.position.x, event.position.y, event.timestamp]);

  // Handle Assists
  if (event.assistingParticipantIds)
  {
    for (let assistId of event.assistingParticipantIds)
    {
      id = assistId-1;
      if (pre15)
      {
        allParticipants[id].assists15 += 1;
      }
      allParticipants[id].assistMap.push([event.position.x, event.position.y, event.timestamp]);
    }
  }

  // Handle Death
  id = event.victimId-1;
  if (pre15)
  {
    allParticipants[id].deaths15 += 1;
  }
  allParticipants[id].deathMap.push([event.position.x, event.position.y, event.timestamp]);
}

function ProcessParticipantFrames(allParticipants: TimelineParticipantStats[], participantsFrame: RiotTimelineParticipantFrameDto)
{
  if (allParticipants.length !== 10)
  {
    throw new Error("Invalid participant count");
  }
  // Idk... how do I do this better with typing...
  ProcessParticipantFrame(allParticipants[0], participantsFrame[1]);
  ProcessParticipantFrame(allParticipants[1], participantsFrame[2]);
  ProcessParticipantFrame(allParticipants[2], participantsFrame[3]);
  ProcessParticipantFrame(allParticipants[3], participantsFrame[4]);
  ProcessParticipantFrame(allParticipants[4], participantsFrame[5]);
  ProcessParticipantFrame(allParticipants[5], participantsFrame[6]);
  ProcessParticipantFrame(allParticipants[6], participantsFrame[7]);
  ProcessParticipantFrame(allParticipants[7], participantsFrame[8]);
  ProcessParticipantFrame(allParticipants[8], participantsFrame[9]);
  ProcessParticipantFrame(allParticipants[9], participantsFrame[10]);
}

function ProcessParticipantFrame(participant: TimelineParticipantStats, frameData: RiotTimelineParticipantFrameDataDto)
{
  participant.goldMap.push(frameData.totalGold);
  participant.xpMap.push(frameData.xp);
  participant.csMap.push(frameData.minionsKilled + frameData.jungleMinionsKilled);
}
