---
title: "Debugging a layout bug without guessing"
slug: "debugging-layout-bug"
date: "2026-03-26"
summary: "How I tracked down a stubborn UI bug by isolating layout constraints instead of randomly changing CSS."
tags:
  - css
  - debugging
  - frontend
published: true
---

## The bug

A card grid looked correct on desktop but collapsed awkwardly on tablet widths.

## The process

I checked container width, grid settings, min widths, and spacing in order. That gave me a clean path instead of trial and error.

## The lesson

Most layout bugs get easier when you inspect parent constraints before touching child components.
