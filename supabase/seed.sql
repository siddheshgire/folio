-- Sample Academic Syllabus Seed Data for FOLIO
-- Subjects
INSERT INTO public.subjects (id, code, name, academic_year, semester, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'CS501', 'Operating Systems', '3rd Year', 5, 'Processes, CPU Scheduling, Deadlocks, Memory Management'),
  ('22222222-2222-2222-2222-222222222222', 'CS502', 'Database Management Systems', '3rd Year', 5, 'Relational Model, SQL, Normalization, Transactions & Concurrency'),
  ('33333333-3333-3333-3333-333333333333', 'CS503', 'Computer Networks', '3rd Year', 5, 'OSI Reference Model, TCP/IP, IP Addressing, Routing Protocols')
ON CONFLICT (code) DO NOTHING;

-- Units for CS501
INSERT INTO public.units (subject_id, name, position)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Unit 1: OS Architecture & System Calls', 1),
  ('11111111-1111-1111-1111-111111111111', 'Unit 2: Process Synchronization & CPU Scheduling', 2),
  ('11111111-1111-1111-1111-111111111111', 'Unit 3: Deadlocks & Handling Strategies', 3),
  ('11111111-1111-1111-1111-111111111111', 'Unit 4: Virtual Memory & Page Replacement', 4);

-- Units for CS502
INSERT INTO public.units (subject_id, name, position)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Unit 1: ER Modeling & Relational Algebra', 1),
  ('22222222-2222-2222-2222-222222222222', 'Unit 2: SQL, Joins & Subqueries', 2),
  ('22222222-2222-2222-2222-222222222222', 'Unit 3: Functional Dependencies & Normalization (1NF to BCNF)', 3);
