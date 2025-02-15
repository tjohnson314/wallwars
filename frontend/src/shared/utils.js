import { uniqueNamesGenerator, names } from "unique-names-generator";

export const roundNum = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

export const prettyDate = (date, longFormat) => {
  if (!date) return "-";
  const curTime = new Date().getTime();
  const dateTime = new Date(date).getTime();
  const seconds = Math.floor((curTime - dateTime) / 1000);
  const secondsIn30Days = 30 * 24 * 60 * 60;
  const months = Math.floor(seconds / secondsIn30Days);
  if (months > 1) return months + (longFormat ? " months" : "mo") + " ago";
  if (months === 1) return "1" + (longFormat ? " month" : "mo") + " ago";
  const secondsInADay = 24 * 60 * 60;
  const days = Math.floor(seconds / secondsInADay);
  if (days > 1) return days + (longFormat ? " days" : "d") + " ago";
  if (days === 1) return "1" + (longFormat ? " day" : "d") + " ago";
  const hours = Math.floor(seconds / 3600);
  if (hours > 1) return hours + (longFormat ? " hours" : "h") + " ago";
  if (hours === 1) return "1" + (longFormat ? " hour" : "h") + " ago";
  const minutes = Math.floor(seconds / 60);
  if (minutes > 1) return minutes + (longFormat ? " minutes" : "m") + " ago";
  if (minutes === 1) return "1" + (longFormat ? " minute" : "m") + " ago";
  if (seconds > 1) return seconds + (longFormat ? " seconds" : "s") + " ago";
  if (seconds === 1) return seconds + (longFormat ? " second" : "s") + " ago";
  return "Just now";
};

export const randPlayerName = (maxPlayerNameLen) =>
  uniqueNamesGenerator({
    dictionaries: [names],
    length: 1,
  }).slice(0, maxPlayerNameLen);

export const randEloId = (maxEloIdLen) => {
  const res = "elo_" + Math.random().toString(36).slice(2);
  return res.slice(0, maxEloIdLen);
};
