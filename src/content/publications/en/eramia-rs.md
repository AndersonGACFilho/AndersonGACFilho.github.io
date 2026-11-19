---
# In the proceedings. `date` is the first day of the event (9 to 11 November
# 2026, Porto Alegre). Pages 13–16 of the proceedings, on SBC OpenLib.
title: 'HTN Method Selection Guided by Multi-Objective Reinforcement Learning and Dynamic Preferences'
date: 2026-11-09
summary: Four-page paper in the graduate track of ERAMIA-RS 2026, and the first version of this work. An HTN keeps the agent inside what the domain allows, and a preference-conditioned multi-objective RL policy picks among the valid methods according to the priorities of the moment. It has the formulation and the evaluation protocol. The experiments, and the full paper, come in 2027.
tracks: [research]
tags: [decision-making, planning, reinforcement-learning]
translationOf: eramia-rs
venue:
  name: ERAMIA-RS 2026
  full: II Escola Regional de Aprendizado de Máquina e Inteligência Artificial da Região Sul (SBC)
  status: published
  url: https://sol.sbc.org.br/index.php/eramiars/article/view/47322
pdf: /papers/eramia-rs.pdf
---

Anderson G. A. C. Filho (the name I sign papers with), Anderson R. Tavares and Lucas N. Alegre,
Instituto de Informática, UFRGS. Four pages, in English. The [version in the proceedings is here as a
PDF](/papers/eramia-rs.pdf), and so is the [poster from ECOA 2026](/research/poster-htn-morl.pdf).

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

This is the first version of the work. It describes the method and how it will be evaluated, and
stops there. The experiments come next, in a controlled game-like environment, against
first-applicable and heuristic HTN selection and two scalar RL baselines. With results in hand, the
full paper goes to a conference in 2027. The [research page](/research) has the longer explanation
and the poster.

## Cite

```bibtex
@inproceedings{filho2026htn,
  author    = {Anderson G. A. C. Filho and Anderson R. Tavares and Lucas N. Alegre},
  title     = {{HTN} Method Selection Guided by Multi-Objective Reinforcement Learning and Dynamic Preferences},
  booktitle = {Anais da II Escola Regional de Aprendizado de M{\'a}quina e Intelig{\^e}ncia Artificial da Regi{\~a}o Sul (ERAMIA-RS)},
  address   = {Porto Alegre, RS},
  publisher = {SBC},
  year      = {2026},
  pages     = {13--16},
  doi       = {10.5753/eramiars.2026.35023},
}
```
