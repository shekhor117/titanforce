-- Disable RLS for public contact form submissions
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts
CREATE POLICY "Allow public to insert contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users (admins) to view all messages
CREATE POLICY "Allow authenticated users to select all contact messages"
  ON contact_messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to update messages
CREATE POLICY "Allow authenticated users to update contact messages"
  ON contact_messages
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete messages
CREATE POLICY "Allow authenticated users to delete contact messages"
  ON contact_messages
  FOR DELETE
  USING (auth.role() = 'authenticated');
