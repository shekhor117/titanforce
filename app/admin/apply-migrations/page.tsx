'use client';

import { useState } from 'react';

export default function ApplyMigrationsPage() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setOutput(prev => [...prev, message]);
  };

  const handleRunMigrations = async () => {
    setLoading(true);
    setError(null);
    setOutput([]);

    try {
      addLog('Starting migration process...');
      addLog('');

      const response = await fetch('/api/admin/apply-all-migrations', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to apply migrations');
        addLog(`Error: ${data.error || 'Unknown error'}`);
        return;
      }

      // Parse the response logs
      if (data.logs) {
        data.logs.forEach((log: string) => addLog(log));
      }

      if (data.success) {
        addLog('');
        addLog('✓ All migrations applied successfully!');
        addLog('The app should now fetch data properly from Supabase.');
      } else {
        addLog('');
        addLog('Some migrations may have failed. Check the logs above.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      addLog(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Database Migration Tool</h1>
        <p className="text-muted-foreground mb-8">
          Apply pending database migrations to Supabase
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Migration Status</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This tool will apply all pending SQL migrations to your Supabase database.
            This includes creating the standings and matches tables, and setting up
            Row Level Security policies.
          </p>

          <button
            onClick={handleRunMigrations}
            disabled={loading}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Running Migrations...' : 'Run Migrations'}
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {output.length > 0 && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 font-mono text-sm">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {output.map((line, i) => (
                <div key={i} className="text-foreground">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
          <h3 className="font-semibold mb-2">What this does:</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>Creates the standings and matches tables</li>
            <li>Sets up Row Level Security policies</li>
            <li>Creates indexes for performance</li>
            <li>Sets up auto-update triggers</li>
            <li>Enables all other pending database features</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
