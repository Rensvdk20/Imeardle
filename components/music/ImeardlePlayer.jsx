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
		songUrl: "https://soundcloud.com/imaginedragons/shots-6",
		title: "Shots",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/real-life-1",
		title: "Real Life",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/love-2",
		title: "Love",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/every-night",
		title: "Every Night",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/believer",
		title: "Believer",
		albumCover:
			"https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/my-fault",
		title: "My Fault",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/i-dont-like-myself",
		title: "I Don't Like Myself",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/trouble-4",
		title: "Trouble",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/younger",
		title: "Younger",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/follow-you",
		title: "Follow You",
		albumCover:
			"https://i1.sndcdn.com/artworks-HnHka0c5mNmM-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/thunder-final",
		title: "Thunder",
		albumCover:
			"https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/it-comes-back-to-you-7",
		title: "It Comes Back To You",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/demons",
		title: "Demons",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/walking-the-wire-2",
		title: "Walking The Wire",
		albumCover:
			"https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/leave-me",
		title: "Leave Me",
		albumCover:
			"https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/polaroid-1",
		title: "Polaroid",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/next-to-me-4",
		title: "Next To Me",
		albumCover:
			"https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/i-dont-mind",
		title: "I Don't Mind",
		albumCover:
			"https://i1.sndcdn.com/artworks-Fx5sRBwAyH7x-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/battle-cry",
		title: "Battle Cry",
		albumCover:
			"https://i1.sndcdn.com/artworks-000135754389-sqjze2-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/dolphins-1",
		title: "Dolphins",
		albumCover:
			"https://i1.sndcdn.com/artworks-Fx5sRBwAyH7x-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/amsterdam",
		title: "Amsterdam",
		albumCover:
			"https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/west-coast",
		title: "West Coast",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/hopeless-opus-3",
		title: "Hopeless Opus",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/burn-out-1",
		title: "Burn Out",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/roots",
		title: "Roots",
		albumCover:
			"https://i1.sndcdn.com/artworks-pd6QnjD634xf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/monday",
		title: "Monday",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/giants",
		title: "Giants",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/release-1",
		title: "Release",
		albumCover:
			"https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/working-man",
		title: "Working Man",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/i-need-a-minute",
		title: "I Need A Minute",
		albumCover:
			"https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/waves-1",
		title: "Waves",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/smoke-and-mirrors-2",
		title: "Smoke And Mirrors",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/bleeding-out",
		title: "Bleeding Out",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/blur",
		title: "Blur",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/take-it-easy",
		title: "Take It Easy",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/the-fall",
		title: "The Fall",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/summer-1",
		title: "Summer",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/look-how-far-weve-come",
		title: "Look How Far We've Come",
		albumCover:
			"https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/uptight",
		title: "Uptight",
		albumCover:
			"https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/monster",
		title: "Monster",
		albumCover:
			"https://i1.sndcdn.com/artworks-000135754389-sqjze2-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/warriors-1",
		title: "Warriors",
		albumCover:
			"https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/mouth-of-the-river",
		title: "Mouth Of The River",
		albumCover:
			"https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/dull-knives",
		title: "Dull Knives",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/sirens",
		title: "Sirens",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/drive",
		title: "Drive",
		albumCover:
			"https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/america",
		title: "America",
		albumCover:
			"https://i1.sndcdn.com/artworks-fG4lr1KRMw0A-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/pantomime",
		title: "Pantomime",
		albumCover:
			"https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/nothing-left-to-say-rocks",
		title: "Nothing Left To Say",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/thief-1",
		title: "Thief",
		albumCover:
			"https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/easy-1",
		title: "Easy",
		albumCover:
			"https://i1.sndcdn.com/artworks-ag1BOxMIF7lt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/dancing-in-the-dark-1",
		title: "Dancing In The Dark",
		albumCover:
			"https://i1.sndcdn.com/artworks-a1lyRK3fIBvn-0-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/no-time-for-toxic-people",
		title: "No Time For Toxic People",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/kygo/born-to-be-yours-with-imagine",
		title: "Born To Be Yours - Kygo",
		albumCover:
			"https://i1.sndcdn.com/artworks-XOiq9FBhHOb1-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/wrecked",
		title: "Wrecked",
		albumCover:
			"https://i1.sndcdn.com/artworks-q5E9rpeK6tVE-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/birds-1",
		title: "Birds",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/yesterday",
		title: "Yesterday",
		albumCover:
			"https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/the-unknown",
		title: "The Unknown",
		albumCover:
			"https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/hole-inside-our-chests",
		title: "Hole Inside Our Chests",
		albumCover:
			"https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/cool-out",
		title: "Cool Out",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/my-life",
		title: "My Life",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/round-and-round",
		title: "Round And Round",
		albumCover:
			"https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/underdog",
		title: "Underdog",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/one-day-1",
		title: "One Day",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/cha-ching-till-we-grow-older",
		title: "Cha-Ching (Till We Grow Older)",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/its-ok",
		title: "It's Ok",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/boomerang-3",
		title: "Boomerang",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/zero-from-the-original-motion",
		title: "Zero",
		albumCover:
			"https://i1.sndcdn.com/artworks-l2l4JaD1kTC0-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/stuck-2",
		title: "Stuck",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/rise-up",
		title: "Rise Up",
		albumCover:
			"https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/i-was-me-1",
		title: "I Was Me",
		albumCover:
			"https://i1.sndcdn.com/artworks-JIuRrW1vDZKW-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/peace-of-mind",
		title: "Peace Of Mind",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/continual-feat-cory-henry",
		title: "Continual (feat. Cory Henry)",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/sharks",
		title: "Sharks",
		albumCover:
			"https://i1.sndcdn.com/artworks-1Qjr719yjvSf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/friction-2",
		title: "Friction",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/cover-up",
		title: "Cover Up",
		albumCover:
			"https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/gold-2",
		title: "Gold",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/ill-make-it-up-to-you-1",
		title: "I'll Make It Up To You",
		albumCover:
			"https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/i-wish",
		title: "I Wish",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/dream-2",
		title: "Dream",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/enemy-from-the-series-arcane-1",
		title: "Enemy (JID)",
		albumCover:
			"https://i1.sndcdn.com/artworks-5YVm14bTIjhk-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/im-happy",
		title: "I'm Happy",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/07-the-river",
		title: "The River",
		albumCover:
			"https://i1.sndcdn.com/artworks-fG4lr1KRMw0A-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/hear-me",
		title: "Hear Me",
		albumCover:
			"https://i1.sndcdn.com/artworks-000003385968-xjtab6-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/digital",
		title: "Digital",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/tiptoe",
		title: "Tiptoe",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/symphony",
		title: "Symphony",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/on-top-of-the-world",
		title: "On Top Of The World",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/higher-ground",
		title: "Higher Ground",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/cutthroat",
		title: "Cutthroat",
		albumCover:
			"https://i1.sndcdn.com/artworks-T25OpQuQBS7X-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/im-so-sorry-4",
		title: "I'm So Sorry",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/ferris-wheel",
		title: "Ferris Wheel",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/1a1",
		title: "#1",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/i-bet-my-life-2",
		title: "I Bet My Life",
		albumCover:
			"https://i1.sndcdn.com/artworks-pkaFVCD58nWt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/emma",
		title: "Emma",
		albumCover:
			"https://i1.sndcdn.com/artworks-000003385968-xjtab6-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/natural",
		title: "Natural",
		albumCover:
			"https://i1.sndcdn.com/artworks-000476640570-vkr6i0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/machine",
		title: "Machine",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/lonely",
		title: "Lonely",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/tied",
		title: "Tied",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/crushed-1",
		title: "Crushed",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/whatever-it-takes-1",
		title: "Whatever It Takes",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/curse",
		title: "Curse",
		albumCover:
			"https://i1.sndcdn.com/artworks-kn99VOLqzgTD-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/who-we-are",
		title: "Who We Are",
		albumCover:
			"https://i1.sndcdn.com/artworks-000135754389-sqjze2-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/all-eyes",
		title: "All Eyes",
		albumCover:
			"https://i1.sndcdn.com/artworks-ag1BOxMIF7lt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/selene",
		title: "Selene",
		albumCover:
			"https://i1.sndcdn.com/artworks-ag1BOxMIF7lt-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/second-chances",
		title: "Second Chances",
		albumCover:
			"https://i1.sndcdn.com/artworks-mus0c9mtxTXG-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/only-2",
		title: "Only",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/i-dont-know-why-2",
		title: "I Don't Know Why",
		albumCover:
			"https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/radioactive-1",
		title: "Radioactive",
		albumCover:
			"https://i1.sndcdn.com/artworks-w6QF0YF3Vvpf-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/start-over",
		title: "Start Over",
		albumCover:
			"https://i1.sndcdn.com/artworks-kGe7HBovynt2-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/tokyo",
		title: "Tokyo",
		albumCover:
			"https://i1.sndcdn.com/artworks-000008149943-razuz8-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/bullet-in-a-gun",
		title: "Bullet In A Gun",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/04-its-time",
		title: "It's Time",
		albumCover:
			"https://i1.sndcdn.com/artworks-fG4lr1KRMw0A-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/bones",
		title: "Bones",
		albumCover:
			"https://i1.sndcdn.com/artworks-9iYxEwEFnF5N-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/easy-come-easy-go-1",
		title: "Easy Come Easy Go",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl:
			"https://soundcloud.com/imaginedragons/they-dont-know-you-like-i-do",
		title: "They Don't Know You Like I Do",
		albumCover:
			"https://i1.sndcdn.com/artworks-6HGngLlgL6rT-0-t500x500.jpg",
	},
	{
		songUrl: "https://soundcloud.com/imaginedragons/bad-liar-3",
		title: "Bad Liar",
		albumCover:
			"https://i1.sndcdn.com/artworks-K0miIpVDyFuP-0-t500x500.jpg",
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
		songUrl: "",
		title: "",
		albumCover: "",
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
				return song.title.toLowerCase().includes(userInput);
			}
		})
		.slice(0, 5);

	const handleGuessOnClick = (e) => {
		handleGuess(e.target.getAttribute("data-title"));
	};

	const handleGuess = (song) => {
		console.log(guessStates.indexOf(guessState) === guessStates.length - 1);
		if (song === currentSong.title) {
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
			return handleGuess(filteredSongs[dropDownIndex].title);
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
			return setUserInput(filteredSongs[dropDownIndex].title);
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
											data-title={song.title}
											onClick={handleGuessOnClick}
											className={
												index === dropDownIndex
													? "active"
													: ""
											}
										>
											{song.title}
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
						currentSongUrl={currentSong.songUrl}
						volume={volume}
						handleProgress={handleProgress}
					/>

					<Modal show={show} onHide={closeModal} centered>
						<Modal.Body>
							<img
								src={currentSong.albumCover}
								alt="album cover"
							/>
							<h1>{currentSong.title}</h1>
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
