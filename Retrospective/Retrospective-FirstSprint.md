# TEMPLATE FOR RETROSPECTIVE (Team 02)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done
- Total points committed vs. done
- Nr of hours planned vs. spent (as a team)

**Remember**a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story           | # Tasks | Points | Hours est. | Hours actual |
| --------------- | ------- | ------ | ---------- | ------------ |
| _Uncategorized_ | 9       | -      | 2d 3h 30m  | 2d 3h 55m    |
| Get ticket      | 6       | 5      | 2d         | 2d 2h 35m    |
| Next customer   | 4       | 8      | 1d 6h 30m  | 2d 4h 30m    |

> story `Uncategorized` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)

|            | Mean | StDev |
| ---------- | ---- | ----- |
| Estimation |      |       |
| Actual     |      |       |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

  $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

  $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases
  - Coverage
- E2E testing:
  - Total hours estimated
  - Total hours spent
  - Nr of test cases
- Code review
  - Total hours estimated
  - Total hours spent

## ASSESSMENT

- What did go wrong in the sprint?

  > Some tasks were not clear enough as written on youtrack creating missunderstandings

- What caused your errors in estimation (if any)?

  > A lack of a defined common project structure caused some missunderstanding, furthermore we did not add some extra time for unexpected errors and bug fixes

- What lessons did you learn (both positive and negative) in this sprint?

  > We need to create tasks with precise definitions and fit them into an overall project structure defined earlier

  > We had enough meetings to catch up with each other work and share prospective on problems, everybody pitching in with fresh ideas.d

- Which improvement goals set in the previous retrospective were you able to achieve?

  > /

- Which ones you were not able to achieve? Why?

  > /

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > At the beginning of the sprint and during it we should keep updating docs regarding the implementation ideas such that it can be common knowledge between team members

  > Try to maximise parallelism on tasks such that nobody should wait for another person to finish its tasks creating

- One thing you are proud of as a Team!!

  > we all drink water
