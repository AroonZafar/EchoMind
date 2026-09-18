Extract structured memory from this speech transcript.

Transcript: "{transcript}"

Respond with ONLY valid JSON, no other text, in exactly this shape:
{{
  "entities": [
    {{"type": "person", "name": "...", "attributes": {{}}}},
    {{"type": "task", "name": "...", "attributes": {{"due": "..."}}}},
    {{"type": "event", "name": "...", "attributes": {{"when": "..."}}}}
  ],
  "relationships": [
    {{"source": "...", "target": "...", "relation": "..."}}
  ],
  "importance": 7,
  "memory_type": "fact",
  "summary": "..."
}}

Rules:
- "entities" is a list of objects, each with exactly the keys "type", "name", "attributes".
- "relationships" is a list of objects with "source", "target", "relation".
- ALWAYS extract EVERY task, deadline, and event mentioned, not just people. A task is any
  thing the speaker says they have to do, need to finish, or must complete, even if phrased
  casually (e.g. "I have to finish X", "gotta send Y", "need to submit Z").
- Never skip a task entity just because a person entity was also mentioned in the same
  sentence or transcript -- extract ALL of them, not just one.
- A relationship's "source" and "target" must EACH be either "I" (the speaker) or the exact
  "name" of one of the entities listed in "entities". NEVER use a raw date, day of week, or
  time (e.g. "Friday", "Thursday", "3pm") as a source or target -- dates/times belong only
  inside that entity's "attributes" (e.g. attributes.due, attributes.when), never as their
  own relationship endpoint.
- If there are no entities or relationships, use empty lists [].
- Do not add any keys other than shown above.

Example:
Transcript: "I have to finish my EchoMind demo before Friday, and I have a meeting with Maya on Thursday."
{{
  "entities": [
    {{"type": "task", "name": "EchoMind demo", "attributes": {{"due": "Friday"}}}},
    {{"type": "person", "name": "Maya", "attributes": {{}}}},
    {{"type": "event", "name": "meeting with Maya", "attributes": {{"when": "Thursday"}}}}
  ],
  "relationships": [
    {{"source": "I", "target": "EchoMind demo", "relation": "must_finish"}},
    {{"source": "I", "target": "meeting with Maya", "relation": "attending"}},
    {{"source": "meeting with Maya", "target": "Maya", "relation": "with"}}
  ],
  "importance": 7,
  "memory_type": "fact",
  "summary": "Speaker has a demo due Friday and a meeting with Maya on Thursday."
}}
Notice "Friday" and "Thursday" appear only inside attributes, never as a relationship source or target.
