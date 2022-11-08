import { TimelineParticipantStats } from '../../../Common/Interface/Database/timeline'
import { RiotTimelineDto, RiotTimelineParticipantFrameDataDto, RiotTimelineParticipantFrameDto } from '../../../Common/Interface/RiotAPI/RiotApiDto'
import { RiotTimelineEvent, RiotTimelineEventChampionKillDto } from '../../../Common/Interface/RiotAPI/RiotApiTimelineEvents'
import logger from '../../logger'
import * as utils from '../../../Common/utils'

function DefaultTimelineStats(): TimelineParticipantStats {
  return {
    has15Stats: false,
    has25Stats: false,

    kills15: 0,
    kills25: 0,
    killMap: [], // x, y, time

    deaths15: 0,
    deaths25: 0,
    deathMap: [], // x, y, time

    wardsPlaced15: 0,
    wardsPlaced25: 0,

    wardsKilled15: 0,
    wardsKilled25: 0,

    assists15: 0,
    assists25: 0,
    assistMap: [], // x, y, time

    goldMap: [], // one entry per minute
    xpMap: [],
    csMap: [],

    killDiff: 0,
    killDiff15: 0,
    killDiff25: 0,

    deathDiff: 0,
    deathDiff15: 0,
    deathDiff25: 0,

    assistDiff: 0,
    assistDiff15: 0,
    assistDiff25: 0,

    goldDiff: 0,
    goldDiff15: 0,
    goldDiff25: 0,

    csDiff: 0,
    csDiff15: 0,
    csDiff25: 0,

    xpDiff: 0,
    xpDiff15: 0,
    xpDiff25: 0,
  } as TimelineParticipantStats
}

export function ProcessTimeline(timeline: RiotTimelineDto): TimelineParticipantStats[] {
  const allParticipants: TimelineParticipantStats[] = []
  const timelineInfo = timeline.info;
  for (let i = 0; i < 10; i++) {
    allParticipants.push(DefaultTimelineStats())
    allParticipants[i].has15Stats = timelineInfo.frames.length > 15;
    allParticipants[i].has25Stats =  timelineInfo.frames.length > 25;
  }

  for (const [i, frame] of timelineInfo.frames.entries()) {
    ProcessEvents(allParticipants, frame.events)
    ProcessParticipantFrames(allParticipants, frame.participantFrames, i)
  }

  const nFrames = timelineInfo.frames.length - 1;
  // One last calculate for end of game diffs
  for (let i = 0; i < allParticipants.length; i ++) {
    calculateDiffs(allParticipants, "killDiff", (participant: TimelineParticipantStats) => participant.kills25);
    calculateDiffs(allParticipants, "assistDiff", (participant: TimelineParticipantStats) => participant.assists25);
    calculateDiffs(allParticipants, "deathDiff", (participant: TimelineParticipantStats) => participant.deaths25);
    calculateDiffs(allParticipants, "goldDiff", (participant: TimelineParticipantStats) => participant.goldMap[nFrames]);
    calculateDiffs(allParticipants, "xpDiff", (participant: TimelineParticipantStats) => participant.xpMap[nFrames]);
    calculateDiffs(allParticipants, "csDiff", (participant: TimelineParticipantStats) => participant.csMap[nFrames]);
  }

  return allParticipants
}

function ProcessEvents(allParticipants: TimelineParticipantStats[], events: RiotTimelineEvent[]): void {
  for (const event of events) {
    const eventMin = utils.riotTimelineTimestampToMinutes(event.timestamp);
    if (utils.EventIsWardKill(event) && eventMin <= 25) {
      const id = event.killerId - 1
      if (id < 0 || id >= 10) {
        logger.debug('Invalid killer id for ward kill: ' + id)
        continue
      }
      allParticipants[id].wardsKilled25 += 1;
      if (eventMin <= 15) {
        allParticipants[id].wardsKilled15 += 1;
      }
    } else if (utils.EventIsWardPlaced(event) && eventMin <= 25) {
      const id = event.creatorId - 1
      if (id < 0 || id >= 10) {
        logger.debug('Invalid killer id for ward placed: ' + id)
        continue
      }
      allParticipants[id].wardsPlaced25 += 1
      if (eventMin <= 15) {
        allParticipants[id].wardsPlaced15 += 1
      }
    } else if (utils.EventIsChampionKill(event)) {
      HandleChampionKill(allParticipants, event)
    }
  }
}

function HandleChampionKill(allParticipants: TimelineParticipantStats[], event: RiotTimelineEventChampionKillDto): void {
  let id = event.killerId - 1
  if (id < 0 || id >= 10) {
    logger.debug('Invalid killer id for champion kill: ' + id)
    return
  }
  const timeMins =  utils.riotTimelineTimestampToMinutes(event.timestamp)

  // Handle kill
  if (timeMins <= 25) {
    allParticipants[id].kills25 += 1;
    if (timeMins <= 15)
      allParticipants[id].kills15 += 1
  }
  allParticipants[id].killMap.push([event.position.x, event.position.y, event.timestamp])

  // Handle Assists
  if (event.assistingParticipantIds) {
    for (const assistId of event.assistingParticipantIds) {
      id = assistId - 1
      if (timeMins <= 25) {
        allParticipants[id].assists25 += 1;
        if (timeMins <= 15)
          allParticipants[id].assists15 += 1;
      }
      allParticipants[id].assistMap.push([event.position.x, event.position.y, event.timestamp])
    }
  }

  // Handle Death
  id = event.victimId - 1
  if (timeMins <= 25) {
    allParticipants[id].deaths25 += 1;
    if (timeMins <= 15)
      allParticipants[id].deaths15 += 1;
  }
  allParticipants[id].deathMap.push([event.position.x, event.position.y, event.timestamp])
}

function ProcessParticipantFrames(allParticipants: TimelineParticipantStats[], participantsFrame: RiotTimelineParticipantFrameDto, frameNumber: number): void {
  if (allParticipants.length !== 10) {
    logger.debug('Invalid participant count: ' + allParticipants.length);
    throw new Error('Invalid participant count');
  }
  // Idk... how do I do this better with typing...
  for (let i = 0; i < allParticipants.length; i ++) {
    ProcessParticipantFrame(allParticipants[i], participantsFrame[(i+1).toString() as keyof RiotTimelineParticipantFrameDto]);
  }

  if (frameNumber === 15) {
    for (let i = 0; i < allParticipants.length; i ++) {
      calculateDiffs(allParticipants, "killDiff15", (participant: TimelineParticipantStats) => participant.kills15);
      calculateDiffs(allParticipants, "assistDiff15", (participant: TimelineParticipantStats) => participant.assists15);
      calculateDiffs(allParticipants, "deathDiff15", (participant: TimelineParticipantStats) => participant.deaths15);
      calculateDiffs(allParticipants, "goldDiff15", (participant: TimelineParticipantStats) => participant.goldMap[frameNumber]);
      calculateDiffs(allParticipants, "xpDiff15", (participant: TimelineParticipantStats) => participant.xpMap[frameNumber]);
      calculateDiffs(allParticipants, "csDiff15", (participant: TimelineParticipantStats) => participant.csMap[frameNumber]);
    }
  }
  if (frameNumber === 25) {
    for (let i = 0; i < allParticipants.length; i ++) {
      calculateDiffs(allParticipants, "killDiff25", (participant: TimelineParticipantStats) => participant.kills25);
      calculateDiffs(allParticipants, "assistDiff25", (participant: TimelineParticipantStats) => participant.assists25);
      calculateDiffs(allParticipants, "deathDiff25", (participant: TimelineParticipantStats) => participant.deaths25);
      calculateDiffs(allParticipants, "goldDiff25", (participant: TimelineParticipantStats) => participant.goldMap[frameNumber]);
      calculateDiffs(allParticipants, "xpDiff25", (participant: TimelineParticipantStats) => participant.xpMap[frameNumber]);
      calculateDiffs(allParticipants, "csDiff25", (participant: TimelineParticipantStats) => participant.csMap[frameNumber]);
    }
  }
}

function ProcessParticipantFrame(participant: TimelineParticipantStats, frameData: RiotTimelineParticipantFrameDataDto): void {
  participant.goldMap.push(frameData.totalGold)
  participant.xpMap.push(frameData.xp)
  participant.csMap.push(frameData.minionsKilled + frameData.jungleMinionsKilled)
}

function calculateDiffs(allParticipants: TimelineParticipantStats[], diffKey: keyof TimelineParticipantStats, getDiff: (participant: TimelineParticipantStats) => number) {
  for (let i = 0; i < allParticipants.length; i ++) {
    // @ts-expect-error
    allParticipants[i][diffKey] = getDiff(allParticipants[i]) - getDiff(allParticipants[((i+5)%10).toString() as keyof RiotTimelineParticipantFrameDto]);
  }
}
