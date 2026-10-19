---
# Accepted, not yet in the proceedings. When it is: `status: published`, the
# `url` of the paper on SBC OpenLib, and `date` set to the date of the proceedings.
title: 'HTN Method Selection Guided by Multi-Objective Reinforcement Learning and Dynamic Preferences'
date: 2026-11-12
summary: Accepted in the graduate track of ERAMIA-RS 2026. An HTN keeps the agent inside what the domain allows, and a preference-conditioned multi-objective RL policy picks among the valid methods according to the priorities of the moment. The paper has the formulation and the evaluation protocol, and no experimental results yet.
tracks: [research]
tags: [decision-making, planning, reinforcement-learning]
translationOf: eramia-rs
venue:
  name: ERAMIA-RS 2026
  full: II Escola Regional de Aprendizado de Máquina e Inteligência Artificial da Região Sul (SBC)
  status: accepted
  # url: https://sol.sbc.org.br/index.php/eramiars/article/view/<id>
pdf: /papers/eramia-rs.pdf
---

Anderson G. A. C. Filho, Anderson R. Tavares and Lucas N. Alegre, Instituto de Informática, UFRGS.
Four pages, in English. The [final version is here as a PDF](/papers/eramia-rs.pdf).

## Abstract

This work proposes a hybrid framework in which Hierarchical Task Network (HTN) method selection
is modeled as a temporally extended hierarchical decision, enabling the selected method to receive
credit according to multiple objectives, each defined by a different reward function. This work
aims to investigate whether the integration of symbolic planning and multi-objective reinforcement
learning can provide adaptive agents while preserving interpretability, designer control, and
explicit semantic constraints. The planned evaluation compares the proposed approach against
traditional HTN method-selection strategies and scalar reinforcement learning baselines,
considering adaptation to different preferences, generalization, semantic validity, and inference
cost.

## A small example

Take one decision with two objectives, progress and survival, and two applicable methods whose
estimated returns are [0.8, 0.2] for m1 and [0.5, 0.5] for m2. With the weights [0.8, 0.2] the
agent picks m1. Move the weights to [0.2, 0.8] and it picks m2. The HTN domain is the same in both
cases.

## Where it stands

The paper describes the method and how it will be evaluated. The experiments come next, in a
controlled game-like environment, against first-applicable and heuristic HTN selection and two
scalar RL baselines. The [research page](/research) has the longer explanation and the poster.
