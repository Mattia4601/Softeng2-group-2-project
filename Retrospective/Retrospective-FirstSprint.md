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

|            | Mean  | StDev |
| ---------- | ----- | ----- |
| Estimation | 2.474 | 2.26  |
| Actual     | 2.973 | 2.90  |

- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

$$\frac{\sum_i \text{spent}_{task_i}}{\sum_i \text{estimation}_{task_i}} - 1 = \frac{56.5}{47} - 1 \approx 1.202 - 1 = 0.202 = 20.2\%$$

**Risultato:** L'errore totale di stima è del **20.2%**, il che significa che il lavoro effettivo ha richiesto circa il 20% in più di tempo rispetto a quanto preventivato.

- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

$$\frac{1}{19}\sum_{i=1}^{19} \left| \frac{spent_{task_i}}{estimation_{task_i}}-1 \right| = \frac{6.12}{19} \approx 32.2\%$$

**Interpretazione:** L'errore medio assoluto per singolo task è del **32.2%**, il che significa che in media ogni singola stima si è discostata dal valore effettivo di circa il 32%. Questo valore è più alto dell'errore totale (20.2%) perché alcuni errori si sono compensati (alcune stime erano troppo alte, altre troppo basse).

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated - `6 h`
  - Total hours spent - `5 h`
  - Nr of automated unit test cases - `11`
  - Coverage - `80%`
- E2E testing:
  - Total hours estimated - `6 h`
  - Total hours spent - `7.5 h`
  - Nr of test cases - `10`
- Code review
  - Total hours estimated - `0 h`
  - Total hours spent - `0 h`

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

  > We all tried to do our part and comunicated well.
  > We also managed to deliver a working piece of software for the user stories committed.
