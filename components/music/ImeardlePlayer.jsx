"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import {
	BsPlayCircle,
	BsPauseCircle,
	BsMusicNoteBeamed,
	BsGithub,
} from "react-icons/bs";

import ReactCanvasConfetti from "react-canvas-confetti";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "./ImeardlePlayer.scss";

import dynamic from "next/dynamic";
const Player = dynamic(() => import("../../components/music/Player"), {
	ssr: false,
});

const songs = [
	{
		url: "https://soundcloud.com/imaginedragons/shots-6",
		answer: "Shots",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/real-life-1",
		answer: "Real Life",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/love-2",
		answer: "Love",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/every-night",
		answer: "Every Night",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/believer",
		answer: "Believer",
		img: "https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/my-fault",
		answer: "My Fault",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/i-dont-like-myself",
		answer: "I Don't Like Myself",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/trouble-4",
		answer: "Trouble",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/younger",
		answer: "Younger",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/follow-you",
		answer: "Follow You",
		img: "https://i1.sndcdn.com/artworks-HnHka0c5mNmM-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/thunder-final",
		answer: "Thunder",
		img: "https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/it-comes-back-to-you-7",
		answer: "It Comes Back To You",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/demons",
		answer: "Demons",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/walking-the-wire-2",
		answer: "Walking The Wire",
		img: "https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/leave-me",
		answer: "Leave Me",
		img: "https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/polaroid-1",
		answer: "Polaroid",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/next-to-me-4",
		answer: "Next To Me",
		img: "https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/i-dont-mind",
		answer: "I Don't Mind",
		img: "https://i1.sndcdn.com/artworks-Fx5sRBwAyH7x-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/battle-cry",
		answer: "Battle Cry",
		img: "https://i1.sndcdn.com/artworks-000135754389-sqjze2-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/dolphins-1",
		answer: "Dolphins",
		img: "https://i1.sndcdn.com/artworks-Fx5sRBwAyH7x-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/amsterdam",
		answer: "Amsterdam",
		img: "https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/west-coast",
		answer: "West Coast",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/hopeless-opus-3",
		answer: "Hopeless Opus",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/burn-out-1",
		answer: "Burn Out",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/roots",
		answer: "Roots",
		img: "https://i1.sndcdn.com/artworks-pd6QnjD634xf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/monday",
		answer: "Monday",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/giants",
		answer: "Giants",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/release-1",
		answer: "Release",
		img: "https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/working-man",
		answer: "Working Man",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/i-need-a-minute",
		answer: "I Need A Minute",
		img: "https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/waves-1",
		answer: "Waves",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/smoke-and-mirrors-2",
		answer: "Smoke And Mirrors",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/bleeding-out",
		answer: "Bleeding Out",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/blur",
		answer: "Blur",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/take-it-easy",
		answer: "Take It Easy",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/the-fall",
		answer: "The Fall",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/summer-1",
		answer: "Summer",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/look-how-far-weve-come",
		answer: "Look How Far We've Come",
		img: "https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/uptight",
		answer: "Uptight",
		img: "https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/monster",
		answer: "Monster",
		img: "https://i1.sndcdn.com/artworks-000135754389-sqjze2-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/warriors-1",
		answer: "Warriors",
		img: "https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/mouth-of-the-river",
		answer: "Mouth Of The River",
		img: "https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/dull-knives",
		answer: "Dull Knives",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/sirens",
		answer: "Sirens",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/drive",
		answer: "Drive",
		img: "https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/america",
		answer: "America",
		img: "https://i1.sndcdn.com/artworks-fG4lr1KRMw0A-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/pantomime",
		answer: "Pantomime",
		img: "https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/nothing-left-to-say-rocks",
		answer: "Nothing Left To Say",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/thief-1",
		answer: "Thief",
		img: "https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/easy-1",
		answer: "Easy",
		img: "https://i1.sndcdn.com/artworks-ag1BOxMIF7lt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/dancing-in-the-dark-1",
		answer: "Dancing In The Dark",
		img: "https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/no-time-for-toxic-people",
		answer: "No Time For Toxic People",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/kygo/born-to-be-yours-with-imagine",
		answer: "Born To Be Yours - Kygo",
		img: "https://i1.sndcdn.com/artworks-XOiq9FBhHOb1-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/wrecked",
		answer: "Wrecked",
		img: "https://i1.sndcdn.com/artworks-q5E9rpeK6tVE-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/birds-1",
		answer: "Birds",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/yesterday",
		answer: "Yesterday",
		img: "https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/the-unknown",
		answer: "The Unknown",
		img: "https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/hole-inside-our-chests",
		answer: "Hole Inside Our Chests",
		img: "https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/cool-out",
		answer: "Cool Out",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/my-life",
		answer: "My Life",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/round-and-round",
		answer: "Round And Round",
		img: "https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/underdog",
		answer: "Underdog",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/one-day-1",
		answer: "One Day",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/cha-ching-till-we-grow-older",
		answer: "Cha-Ching (Till We Grow Older)",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/its-ok",
		answer: "It's Ok",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/boomerang-3",
		answer: "Boomerang",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/zero-from-the-original-motion",
		answer: "Zero",
		img: "https://i1.sndcdn.com/artworks-l2l4JaD1kTC0-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/stuck-2",
		answer: "Stuck",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/rise-up",
		answer: "Rise Up",
		img: "https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/i-was-me-1",
		answer: "I Was Me",
		img: "https://i1.sndcdn.com/artworks-JIuRrW1vDZKW-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/peace-of-mind",
		answer: "Peace Of Mind",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/continual-feat-cory-henry",
		answer: "Continual (feat. Cory Henry)",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/sharks",
		answer: "Sharks",
		img: "https://i1.sndcdn.com/artworks-1Qjr719yjvSf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/friction-2",
		answer: "Friction",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/cover-up",
		answer: "Cover Up",
		img: "https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/gold-2",
		answer: "Gold",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/ill-make-it-up-to-you-1",
		answer: "I'll Make It Up To You",
		img: "https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/i-wish",
		answer: "I Wish",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/dream-2",
		answer: "Dream",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/enemy-from-the-series-arcane-1",
		answer: "Enemy (JID)",
		img: "https://i1.sndcdn.com/artworks-5YVm14bTIjhk-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/im-happy",
		answer: "I'm Happy",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/07-the-river",
		answer: "The River",
		img: "https://i1.sndcdn.com/artworks-fG4lr1KRMw0A-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/hear-me",
		answer: "Hear Me",
		img: "https://i1.sndcdn.com/artworks-000003385968-xjtab6-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/digital",
		answer: "Digital",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/tiptoe",
		answer: "Tiptoe",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/symphony",
		answer: "Symphony",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/on-top-of-the-world",
		answer: "On Top Of The World",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/higher-ground",
		answer: "Higher Ground",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/cutthroat",
		answer: "Cutthroat",
		img: "https://i1.sndcdn.com/artworks-T25OpQuQBS7X-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/im-so-sorry-4",
		answer: "I'm So Sorry",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/ferris-wheel",
		answer: "Ferris Wheel",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/1a1",
		answer: "#1",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/i-bet-my-life-2",
		answer: "I Bet My Life",
		img: "https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/emma",
		answer: "Emma",
		img: "https://i1.sndcdn.com/artworks-000003385968-xjtab6-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/natural",
		answer: "Natural",
		img: "https://i1.sndcdn.com/artworks-000476640570-vkr6i0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/machine",
		answer: "Machine",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/lonely",
		answer: "Lonely",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/tied",
		answer: "Tied",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/crushed-1",
		answer: "Crushed",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/whatever-it-takes-1",
		answer: "Whatever It Takes",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/curse",
		answer: "Curse",
		img: "https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/who-we-are",
		answer: "Who We Are",
		img: "https://i1.sndcdn.com/artworks-000135754389-sqjze2-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/all-eyes",
		answer: "All Eyes",
		img: "https://i1.sndcdn.com/artworks-ag1BOxMIF7lt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/selene",
		answer: "Selene",
		img: "https://i1.sndcdn.com/artworks-ag1BOxMIF7lt-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/second-chances",
		answer: "Second Chances",
		img: "https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/only-2",
		answer: "Only",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/i-dont-know-why-2",
		answer: "I Don't Know Why",
		img: "https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/radioactive-1",
		answer: "Radioactive",
		img: "https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/start-over",
		answer: "Start Over",
		img: "https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/tokyo",
		answer: "Tokyo",
		img: "https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/bullet-in-a-gun",
		answer: "Bullet In A Gun",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/04-its-time",
		answer: "It's Time",
		img: "https://i1.sndcdn.com/artworks-fG4lr1KRMw0A-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/bones",
		answer: "Bones",
		img: "https://i1.sndcdn.com/artworks-9iYxEwEFnF5N-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/easy-come-easy-go-1",
		answer: "Easy Come Easy Go",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/they-dont-know-you-like-i-do",
		answer: "They Don't Know You Like I Do",
		img: "https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		url: "https://soundcloud.com/imaginedragons/bad-liar-3",
		answer: "Bad Liar",
		img: "https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
];

const state = {
	playing: false,
	volume: 1,
	playedInSeconds: 0,
	played: 0,
};

const canvasStyles = {
	position: "fixed",
	pointerEvents: "none",
	width: "100%",
	height: "100%",
	top: 0,
	left: 0,
};

const ImeardlePlayer = () => {
	// ##### Imeardle player #####
	const playerRef = useRef(null);
	const [playerState, setPlayerState] = useState(state);
	const { playing, volume, playedInSeconds } = playerState;

	const [modalMessageState, setModalMessageState] = useState("");
	const [randomizeButtonCooldown, setRandomizeButtonCooldown] =
		useState(false);

	const [guessed, setGuessedState] = useState(false);

	// Current song
	const [currentSong, setCurrentSong] = useState({
		url: "",
		answer: "",
		img: "",
	});

	// Guess states
	const guessStates = [2, 4, 8, 13, 20];
	const [guessState, setGuessState] = useState(guessStates[0]);

	// User input
	const [userInput, setUserInput] = useState("");

	// Selected dropdownbox
	const [dropDownIndex, setDropDownIndex] = useState(0);

	useEffect(() => {
		// Randomize a song at the start
		randomizeSong(false);

		document.addEventListener("keydown", function (e) {
			if (e.keyCode === "179") {
				e.preventDefault();
			}
		});
	}, []);

	// Randomize a song from the given songs array
	const randomizeSong = (play = true) => {
		// Cooldown for the randomize button
		setRandomizeButtonCooldown(true);
		setTimeout(() => {
			setRandomizeButtonCooldown(false);
		}, 1000);

		// Reset guess state
		setGuessState(guessStates[0]);

		//Set guessed to false
		setGuessedState(false);

		// Set the song to the beginning
		handleStartFromBeginning();

		if (play) {
			handlePlay();
		}

		const randomSong = songs[Math.floor(Math.random() * songs.length)];
		setCurrentSong(randomSong);
		console.log(randomSong);
	};

	// ##### User input handlers #####
	const userInputHandler = (e) => {
		let lowerCaseInput = e.target.value.toLowerCase();
		setUserInput(lowerCaseInput);
	};

	const filteredSongs = songs
		.filter((song) => {
			if (userInput.input === "") {
				return song;
			} else {
				return song.answer.toLowerCase().includes(userInput);
			}
		})
		.slice(0, 5);

	const handleGuessOnClick = (e) => {
		handleGuess(e.target.getAttribute("data-answer"));
	};

	const handleGuess = (song) => {
		console.log(guessStates.indexOf(guessState) === guessStates.length - 1);
		if (song === currentSong.answer) {
			setModalMessageState("Congrats!");
			// Correct answer
			// View the song
			openModal();

			setGuessedState(true);

			// Empty user input & Set select dropdown item to 0
			setUserInput("");
			setDropDownIndex(0);

			// Put the song at the beginning
			handleStartFromBeginning();

			//Make the song fully play
			// setGuessState(guessStates[guessStates.length - 1]);
			setGuessState(29);

			// Play the song
			handlePlay();
		} else {
			// Incorrect answer

			// Check if input is empty
			if (userInput === "") {
				return;
			}

			setUserInput("");
			if (guessState < 20) {
				increaseGuessState();
			} else {
				setModalMessageState("Unlucky, try again!");
				// No more guesses left
				openModal();
			}
		}
	};

	const closeModalAndRandomizeNewSong = () => {
		//Close modal
		closeModal();

		//Wait for the modal to close
		setTimeout(() => {
			//Get a new song
			randomizeSong();
		}, 150);
	};

	const handleDropdownArrowKeys = (e) => {
		console.log(dropDownIndex);

		if (e.keyCode === 13) {
			return handleGuess(filteredSongs[dropDownIndex].answer);
		}

		if (e.keyCode === 38) {
			if (dropDownIndex > 0) {
				return setDropDownIndex(dropDownIndex - 1);
			}

			return setDropDownIndex(filteredSongs.length - 1);
		}

		if (e.keyCode === 40) {
			if (dropDownIndex < filteredSongs.length - 1) {
				return setDropDownIndex(dropDownIndex + 1);
			}

			return setDropDownIndex(0);
		}

		if (e.key === "Tab") {
			e.preventDefault();
			return setUserInput(filteredSongs[dropDownIndex].answer);
		}
	};

	// ##### Player handlers #####
	const handleProgress = (e) => {
		setPlayerState({
			...playerState,
			playedInSeconds: e.playedSeconds,
			played: e.played,
		});

		console.log("guessState", guessState);
		if (e.playedSeconds > guessState) {
			handleStartFromBeginning();
		}

		console.log(playerState);
	};

	// ##### Player controls #####

	const handlePlayPause = () => {
		setPlayerState({
			...playerState,
			playing: !playerState.playing,
		});
		console.log(playerState);
	};

	const handlePlay = () => {
		setPlayerState({
			...playerState,
			playing: true,
		});
	};

	const handleStartFromBeginning = () => {
		setPlayerState({
			...playerState,
			playing: false,
			playedInSeconds: 0,
			played: 0,
		});

		playerRef?.current?.seekTo(0);
	};

	// Game functions

	const increaseGuessState = () => {
		handleStartFromBeginning();
		setGuessState(guessStates[guessStates.indexOf(guessState) + 1]);
	};

	// ##### Confetti #####
	const refAnimationInstance = useRef(null);

	const getInstance = useCallback((instance) => {
		refAnimationInstance.current = instance;
	}, []);

	const makeShot = useCallback((particleRatio, opts) => {
		refAnimationInstance.current &&
			refAnimationInstance.current({
				...opts,
				origin: { y: 0.7 },
				particleCount: Math.floor(200 * particleRatio),
			});
	}, []);

	const fire = useCallback(() => {
		makeShot(0.25, {
			spread: 26,
			startVelocity: 55,
		});

		makeShot(0.2, {
			spread: 60,
		});

		makeShot(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		});

		makeShot(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		});

		makeShot(0.1, {
			spread: 120,
			startVelocity: 45,
		});
	}, [makeShot]);

	// ##### Modal #####
	const [show, setShow] = useState(false);

	const closeModal = () => setShow(false);
	const openModal = () => {
		setShow(true);
		setTimeout(() => {
			fire();
		}, 500);
	};

	return (
		<div className="row player">
			<div className="col-12 col-sm-8 col-pps col-md-8 col-lg-6 col-xl-6 col-xxl-4">
				<div className="player-container">
					<div className="row">
						<div className="col-12 col-progress-bar">
							<div
								className="progress-bar"
								data-currenttime={
									playedInSeconds.toFixed(0) < 10
										? "0:0" + playedInSeconds.toFixed(0)
										: "0:" + playedInSeconds.toFixed(0)
								}
							>
								<div
									className={
										"progress-bar-container " +
										(playing ? "playing" : "")
									}
									style={{
										width: playedInSeconds * 3.5 + "%",
									}}
								>
									{guessStates.map((guessState, index) => (
										<div
											className="progress-bar-line"
											style={{
												width: guessState * 1.05 + "vw",
											}}
										></div>
									))}
								</div>
							</div>

							<p className="guesses-left">
								Guesses left:{" "}
								{guessStates.length -
									guessStates.indexOf(guessState)}
							</p>
						</div>
						<div className="col-12 col-controls">
							<button
								className="btn btn-controls btn-play-pause"
								onClick={handlePlayPause}
							>
								{playerState.playing ? (
									<BsPauseCircle size={40} />
								) : (
									<BsPlayCircle size={40} />
								)}
							</button>
							<button
								className="btn btn-controls btn-randomize"
								onClick={randomizeSong}
								disabled={randomizeButtonCooldown}
							>
								<BsMusicNoteBeamed size={40} />
							</button>
						</div>
						<div className="col-12 col-search-box">
							<div className="search-box">
								<input
									type="text"
									value={userInput}
									onChange={userInputHandler}
									onKeyDown={handleDropdownArrowKeys}
									placeholder={
										guessed
											? "Randomize a new song"
											: "Guess the song..."
									}
									disabled={guessed ? true : false}
								/>
								<ul
									className={
										userInput.length === 0 ? "hide" : ""
									}
								>
									{filteredSongs.map((song, index) => (
										<li
											key={index}
											data-answer={song.answer}
											onClick={handleGuessOnClick}
											className={
												index === dropDownIndex
													? "active"
													: ""
											}
										>
											{song.answer}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					<Player
						id="player"
						playerRef={playerRef}
						playing={playing}
						currentSongUrl={currentSong.url}
						volume={volume}
						handleProgress={handleProgress}
					/>

					<Modal show={show} onHide={closeModal} centered>
						<Modal.Body>
							<img src={currentSong.img} alt="album cover" />
							<h1>{currentSong.answer}</h1>
							<h2>{modalMessageState}</h2>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={closeModal}>
								Close
							</Button>
							<Button
								variant="primary"
								onClick={closeModalAndRandomizeNewSong}
							>
								New Song
							</Button>
						</Modal.Footer>

						<ReactCanvasConfetti
							refConfetti={getInstance}
							style={canvasStyles}
						/>
					</Modal>
				</div>
				<a
					href="https://github.com/Rensvdk20"
					rel="noreferrer"
					target="_blank"
				>
					<BsGithub size={20} id="github" />
				</a>
			</div>
		</div>
	);
};

export default ImeardlePlayer;
