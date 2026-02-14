import { useCoupleStore } from '@/stores/useCoupleStore';
import { useProfileStore } from '@/stores/useProfileStore';
import { useNotesStore } from '@/stores/useNotesStore';
import { useMemoriesStore } from '@/stores/useMemoriesStore';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { useBucketStore } from '@/stores/useBucketStore';
import { useSongStore } from '@/stores/useSongStore';
import { THEMES } from './constants';

const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const generateYearbookHtml = (): string => {
  const profile = useCoupleStore.getState().profile;
  const partner1 = useProfileStore.getState().partner1;
  const partner2 = useProfileStore.getState().partner2;
  const notes = useNotesStore.getState().notes;
  const memories = useMemoriesStore.getState().memories;
  const milestones = useTimelineStore.getState().milestones;
  const bucketItems = useBucketStore.getState().items;
  const songs = useSongStore.getState().songs;

  const themeName = profile?.theme ?? 'rose';
  const colors = THEMES[themeName];
  const name1 = partner1?.name ?? 'Partner 1';
  const name2 = partner2?.name ?? 'Partner 2';
  const anniversary = profile?.anniversaryDate
    ? new Date(profile.anniversaryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Sort entries chronologically
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const sortedMemories = [...memories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const completedBucket = bucketItems.filter((b) => b.isCompleted);
  const sortedSongs = [...songs].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page { margin: 40px; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      color: #1C1917;
      background: #fff;
      line-height: 1.6;
    }
    .cover {
      text-align: center;
      padding: 80px 40px;
      page-break-after: always;
      border: 3px solid ${colors.primary};
      border-radius: 12px;
      margin-bottom: 40px;
    }
    .cover h1 {
      font-size: 42px;
      color: ${colors.primary};
      margin-bottom: 12px;
    }
    .cover .names {
      font-size: 28px;
      color: ${colors.primary};
      font-style: italic;
      margin-bottom: 20px;
    }
    .cover .date {
      font-size: 16px;
      color: #78716C;
    }
    .cover .heart {
      font-size: 48px;
      margin: 20px 0;
    }
    .section {
      page-break-before: always;
      margin-bottom: 40px;
    }
    .section:first-of-type {
      page-break-before: auto;
    }
    .section-title {
      font-size: 28px;
      color: ${colors.primary};
      border-bottom: 2px solid ${colors.accent};
      padding-bottom: 8px;
      margin-bottom: 24px;
    }
    .entry {
      margin-bottom: 20px;
      padding: 16px;
      background: ${colors.primarySoft};
      border-radius: 8px;
      border-left: 4px solid ${colors.primary};
    }
    .entry-date {
      font-size: 12px;
      color: #78716C;
      margin-bottom: 4px;
    }
    .entry-title {
      font-size: 16px;
      font-weight: bold;
      color: #1C1917;
    }
    .entry-content {
      font-size: 14px;
      color: #44403C;
      margin-top: 6px;
      white-space: pre-wrap;
    }
    .entry-author {
      font-size: 12px;
      color: ${colors.primary};
      font-style: italic;
      margin-top: 4px;
    }
    .memory-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .memory-card {
      width: 48%;
      background: ${colors.primarySoft};
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .memory-caption {
      font-size: 13px;
      color: #44403C;
      margin-top: 6px;
    }
    .song-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: ${colors.primarySoft};
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .song-emoji { font-size: 20px; }
    .song-info { flex: 1; }
    .song-title { font-size: 14px; font-weight: bold; color: #1C1917; }
    .song-artist { font-size: 12px; color: #78716C; }
    .bucket-item {
      padding: 8px 0;
      border-bottom: 1px solid ${colors.accent}40;
      font-size: 14px;
    }
    .bucket-item .check { color: ${colors.primary}; margin-right: 8px; }
    .footer {
      text-align: center;
      padding: 40px;
      color: #78716C;
      font-size: 12px;
      page-break-before: always;
    }
    .footer .heart { font-size: 32px; margin-bottom: 12px; }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      margin: 24px 0;
    }
    .stat {
      text-align: center;
      padding: 16px;
      background: ${colors.primarySoft};
      border-radius: 8px;
      min-width: 120px;
    }
    .stat-number {
      font-size: 28px;
      font-weight: bold;
      color: ${colors.primary};
    }
    .stat-label {
      font-size: 12px;
      color: #78716C;
      margin-top: 4px;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover">
    <div class="heart">\u2764\ufe0f</div>
    <h1>Our Yearbook</h1>
    <div class="names">${escapeHtml(name1)} & ${escapeHtml(name2)}</div>
    ${anniversary ? `<div class="date">Together since ${escapeHtml(anniversary)}</div>` : ''}
    <div class="date" style="margin-top: 20px;">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat">
      <div class="stat-number">${notes.length}</div>
      <div class="stat-label">Love Notes</div>
    </div>
    <div class="stat">
      <div class="stat-number">${memories.length}</div>
      <div class="stat-label">Memories</div>
    </div>
    <div class="stat">
      <div class="stat-number">${milestones.length}</div>
      <div class="stat-label">Milestones</div>
    </div>
    <div class="stat">
      <div class="stat-number">${completedBucket.length}</div>
      <div class="stat-label">Bucket List Done</div>
    </div>
    <div class="stat">
      <div class="stat-number">${songs.length}</div>
      <div class="stat-label">Songs Dedicated</div>
    </div>
  </div>

  <!-- Timeline -->
  ${sortedMilestones.length > 0 ? `
  <div class="section">
    <h2 class="section-title">\u{1F4D6} Our Timeline</h2>
    ${sortedMilestones
      .map(
        (m) => `
      <div class="entry">
        <div class="entry-date">${formatDate(m.date)}</div>
        <div class="entry-title">${m.icon ?? ''} ${escapeHtml(m.title)}</div>
        ${m.description ? `<div class="entry-content">${escapeHtml(m.description)}</div>` : ''}
      </div>`
      )
      .join('')}
  </div>` : ''}

  <!-- Love Notes -->
  ${sortedNotes.length > 0 ? `
  <div class="section">
    <h2 class="section-title">\u{1F48C} Love Notes</h2>
    ${sortedNotes
      .slice(0, 50) // Limit to 50 notes for PDF size
      .map(
        (n) => `
      <div class="entry">
        <div class="entry-date">${formatDate(n.createdAt)}</div>
        <div class="entry-content">${escapeHtml(n.content)}</div>
        <div class="entry-author">\u2014 ${n.author === 'partner1' ? escapeHtml(name1) : escapeHtml(name2)} ${n.mood ?? ''}</div>
      </div>`
      )
      .join('')}
    ${sortedNotes.length > 50 ? `<p style="color: #78716C; text-align: center; margin-top: 16px;">...and ${sortedNotes.length - 50} more notes</p>` : ''}
  </div>` : ''}

  <!-- Memories -->
  ${sortedMemories.length > 0 ? `
  <div class="section">
    <h2 class="section-title">\u{1F4F8} Memories</h2>
    <div class="memory-grid">
      ${sortedMemories
        .slice(0, 30) // Limit for PDF size
        .map(
          (m) => `
        <div class="memory-card">
          <div class="entry-date">${formatDate(m.date)}</div>
          <div class="memory-caption">${escapeHtml(m.caption)}</div>
          ${m.location ? `<div class="entry-date">\u{1F4CD} ${escapeHtml(m.location)}</div>` : ''}
        </div>`
        )
        .join('')}
    </div>
    ${sortedMemories.length > 30 ? `<p style="color: #78716C; text-align: center; margin-top: 16px;">...and ${sortedMemories.length - 30} more memories</p>` : ''}
  </div>` : ''}

  <!-- Song Dedications -->
  ${sortedSongs.length > 0 ? `
  <div class="section">
    <h2 class="section-title">\u{1F3B5} Our Soundtrack</h2>
    ${sortedSongs
      .map(
        (s) => `
      <div class="song-row">
        <span class="song-emoji">\u{1F3B5}</span>
        <div class="song-info">
          <div class="song-title">${escapeHtml(s.title)}</div>
          <div class="song-artist">${escapeHtml(s.artist)}</div>
          ${s.message ? `<div style="font-size: 12px; color: #78716C; font-style: italic; margin-top: 4px;">"${escapeHtml(s.message)}"</div>` : ''}
        </div>
        <div class="entry-date">${formatDate(s.createdAt)}</div>
      </div>`
      )
      .join('')}
  </div>` : ''}

  <!-- Bucket List -->
  ${completedBucket.length > 0 ? `
  <div class="section">
    <h2 class="section-title">\u2728 Things We Did Together</h2>
    ${completedBucket
      .map(
        (b) => `
      <div class="bucket-item">
        <span class="check">\u2713</span>
        ${escapeHtml(b.title)}
        ${b.completedDate ? ` <span style="color: #78716C; font-size: 12px;">\u2014 ${formatDate(b.completedDate)}</span>` : ''}
      </div>`
      )
      .join('')}
  </div>` : ''}

  <!-- Footer -->
  <div class="footer">
    <div class="heart">\u2764\ufe0f</div>
    <p><strong>${escapeHtml(name1)} & ${escapeHtml(name2)}</strong></p>
    <p style="margin-top: 8px;">Made with love using the "Us" app</p>
    <p style="margin-top: 4px;">${new Date().getFullYear()}</p>
  </div>

</body>
</html>`;
};
