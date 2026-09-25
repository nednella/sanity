-- Name the content by Wise Old Man's metric key, the same way snapshots name their skills and bosses, so the
-- site reads the display name and the icon from one value. Retired content keeps its old name, since Wise Old
-- Man has no metric to match it to.
UPDATE "speedrun_content" SET "name" = CASE "name"
  WHEN 'Chambers of Xeric' THEN 'chambers_of_xeric'
  WHEN 'Chambers of Xeric (Challenge Mode)' THEN 'chambers_of_xeric_challenge_mode'
  WHEN 'Corrupted Gauntlet' THEN 'the_corrupted_gauntlet'
  WHEN 'Fortis Colosseum' THEN 'sol_heredit'
  WHEN 'Theatre of Blood' THEN 'theatre_of_blood'
  WHEN 'Theatre of Blood (Hard Mode)' THEN 'theatre_of_blood_hard_mode'
  WHEN 'Tombs of Amascut' THEN 'tombs_of_amascut'
  WHEN 'TzKal-Zuk' THEN 'tzkal_zuk'
  WHEN 'TzTok-Jad' THEN 'tztok_jad'
  ELSE "name"
END;
