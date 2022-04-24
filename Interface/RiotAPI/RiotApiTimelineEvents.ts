export enum RiotTimelineEventType
{
  ITEM_PURCHASED = <any>"ITEM_PURCHASED",
  ITEM_DESTROYED = <any>"ITEM_DESTROYED",
  ITEM_SOLD = <any>"ITEM_SOLD",
  ITEM_UNDO = <any>"ITEM_UNDO",
  LEVEL_UP = <any>"LEVEL_UP",
  SKILL_LEVEL_UP = <any>"SKILL_LEVEL_UP",
  PAUSE_END = <any>"PAUSE_END",
  WARD_PLACED = <any>"WARD_PLACED",
  WARD_KILL = <any>"WARD_KILL",
  CHAMPION_KILL = <any>"CHAMPION_KILL",
  CHAMPION_ASSIST = <any>"CHAMPION_ASSIST", // Not actually a timeline event, created for database
  CHAMPION_SPECIAL_KILL = <any>"CHAMPION_SPECIAL_KILL",
  TURRET_PLATE_DESTROYED = <any>"TURRET_PLATE_DESTROYED",
  ELITE_MONSTER_KILL = <any>"ELITE_MONSTER_KILL",
}

export interface RiotTimelineEvent
{
  type: RiotTimelineEventType;
  timestamp: number;
}

export interface RiotTimelineEventPauseEnd extends RiotTimelineEvent
{
  realTimeStamp: number;
}

export interface RiotTimelineEventItemPurchasedDto extends RiotTimelineEvent
{
  participantId: number;
  itemId: number;
}

export interface RiotTimelineEventItemSoldDto extends RiotTimelineEvent
{
  itemId: number;
  participantId: number;
}

export interface RiotTimelineEventItemUndoDto extends RiotTimelineEvent
{
  afterId: number;
  beforeId: number;
  goldGain: number;
  participantId: number;
}

export interface RiotTimelineEventSkillLevelUpDto extends RiotTimelineEvent
{
  levelUpType: string; // TODO: to enum
  participantId: number;
  skillSlot: number;
}

export interface RiotTimelineEventLevelUpDto extends RiotTimelineEvent
{
  level: number;
  participantId: number;
}

export interface RiotTimelineEventItemDestroyedDto extends RiotTimelineEvent
{
  itemId: number;
  participantId: number;
}

export interface RiotTimelineEventWardPlacedDto extends RiotTimelineEvent
{
  creatorId: number;
  wardType: string; // TODO: to enum
}

export interface RiotTimelineEventWardKillDto extends RiotTimelineEvent
{
  killerId: number;
  wardType: string; // TODO: to enum
}

export interface RiotTimelineEventChampionKillDamageDto
{
  basic: boolean;
  magicDamage: number;
  name: string;
  participantId: number;
  physicalDamage: number;
  spellName: string;
  spellSlot: number;
  trueDamage: number;
  type: string;
}

export interface RiotTimelineEventChampionKillDto extends RiotTimelineEvent
{
  assistingParticipantIds?: number[];
  bounty: number;
  killStreakLength: number;
  killerId: number;
  position: { x: number; y: number; };
  victimDamageDealth: RiotTimelineEventChampionKillDamageDto[];
  victimDamageReceived: RiotTimelineEventChampionKillDamageDto[];
  victimId: number;
}

export interface RiotTimelineEventChampionSpecialKillDto extends RiotTimelineEvent
{
  killType: string; // TODO: to enum
  killerId: number;
  position: { x: number; y: number };
}

export interface RiotTimelineEventTurretPlateDestroyedDto  extends RiotTimelineEvent
{
  killerId: number;
  laneType: string; // TODO: to enum
  position: { x: number; y: number };
  teamId: number;
}

export interface RiotTimelineEventEliteMonsterKill extends RiotTimelineEvent
{
  assistingParticipantIds: string[];
  killerId: number;
  killerTeamId: number;
  monsterSubType: string;
  monsterType: string;
  position: { x: number; y: number };
}
