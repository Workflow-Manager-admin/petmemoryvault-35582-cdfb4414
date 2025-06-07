import React, { useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 */
function Navigation({ currentSection, setCurrentSection }) {
  /** Top navigation for main sections */
  const SECTIONS = [
    "Home",
    "Timeline",
    "Photos",
    "Milestones",
    "Scrapbook"
  ];
  return (
    <nav className="navbar pmv-navbar">
      <div className="container pmv-nav-container">
        <div className="logo pmv-logo">
          <span role="img" aria-label="Paw" className="logo-symbol pmv-logo-symbol">🐾</span>
          PetMemoryVault
        </div>
        <div className="pmv-nav-links">
          {SECTIONS.map(section => (
            <button
              key={section}
              className={`pmv-nav-link${currentSection === section ? " active" : ""}`}
              onClick={() => setCurrentSection(section)}
            >
              {section}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

/**
 * PUBLIC_INTERFACE
 */
function PetProfileImage({ profileImage, setProfileImage }) {
  /** Allows users to upload/set their pet's profile image */
  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImage(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="pmv-profile-img-container">
      <div className="pmv-profile-img-frame">
        <img
          src={profileImage || "/paw.png"}
          alt="Pet Profile"
          className="pmv-profile-img"
        />
      </div>
      <label className="pmv-upload-btn">
        Change Photo
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </label>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Home Section: only allows editing/updating pet name and profile photo
 */
function Home({ profileImage, setProfileImage, petName, setPetName }) {
  return (
    <div className="pmv-hero pmv-home-hero">
      <PetProfileImage profileImage={profileImage} setProfileImage={setProfileImage} />
      <input
        className="pmv-input"
        style={{ fontSize: "1.7rem", fontWeight: 600, textAlign: "center", maxWidth: 340 }}
        value={petName}
        onChange={e => setPetName(e.target.value)}
        placeholder="Pet's Name"
      />
      <div className="pmv-main-description">
        Welcome to your PetMemoryVault! Upload a profile photo and enter your pet's name to get started.
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * AddMemory: now includes 'age' (years/months) field (required)
 */
function AddMemory({ onAdd }) {
  const [memoryText, setMemoryText] = useState('');
  const [memoryPhoto, setMemoryPhoto] = useState(null);
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');

  const handlePhotoChange = e => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setMemoryPhoto(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Age is optional but at least one field (years/months) must be provided
    if (!memoryText && !memoryPhoto) return;
    const ageLabel = (ageYears || ageMonths)
      ? `${ageYears ? ageYears + ' yr' + (parseInt(ageYears) !== 1 ? 's' : '') : ''}${(ageYears && ageMonths) ? ' ' : ''}${ageMonths ? ageMonths + ' mo' + (parseInt(ageMonths) !== 1 ? 's' : '') : ''}`.trim()
      : '';
    onAdd({
      text: memoryText,
      photo: memoryPhoto,
      date: new Date().toISOString(),
      age: ageLabel,
      type: 'memory'
    });
    setMemoryText('');
    setMemoryPhoto(null);
    setAgeYears('');
    setAgeMonths('');
  };

  return (
    <form className="pmv-memory-form" onSubmit={handleSubmit}>
      <textarea
        className="pmv-input pmv-memory-text"
        placeholder="Share a memory…"
        value={memoryText}
        onChange={e => setMemoryText(e.target.value)}
        rows={2}
      />
      <div className="pmv-form-row">
        <input
          className="pmv-input"
          type="number"
          min="0"
          max="50"
          style={{ width: 88 }}
          value={ageYears}
          placeholder="Age (yrs)"
          onChange={e => setAgeYears(e.target.value.replace(/[^0-9]/g, ""))}
        />
        <input
          className="pmv-input"
          type="number"
          min="0"
          max="11"
          style={{ width: 92 }}
          value={ageMonths}
          placeholder="Age (mo)"
          onChange={e => setAgeMonths(e.target.value.replace(/[^0-9]/g, ""))}
        />
        <label className="pmv-upload-btn pmv-upload-small">
          {memoryPhoto ? "Change Photo" : "Add Photo"}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </label>
        {memoryPhoto && (
          <img src={memoryPhoto} alt="Memory Upload Preview" className="pmv-thumb-preview" />
        )}
        <button className="btn pmv-btn-accent pmv-btn-add-memory" type="submit">
          Add Memory
        </button>
      </div>
    </form>
  );
}

/**
 * PUBLIC_INTERFACE
 * Timeline page - all memories including age & photo
 */
function Timeline({ memories, onAddMemory, onShare }) {
  return (
    <div>
      <section className="pmv-timeline-header">
        <h2 className="pmv-section-title">Timeline</h2>
        <button className="pmv-btn-secondary btn pmv-btn-share" onClick={onShare}>Share My Story</button>
      </section>
      <AddMemory onAdd={onAddMemory} />
      <ul className="pmv-timeline-list">
        {[...memories].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, idx) =>
          <li key={idx} className="pmv-timeline-item">
            <div className="pmv-timeline-date">
              {new Date(item.date).toLocaleString()}
              {item.age ? <> – <b>{item.age} old</b></> : null}
            </div>
            <div className="pmv-timeline-content">
              {item.photo && (
                <img className="pmv-timeline-photo" src={item.photo} alt="memory visual" />
              )}
              <div className="pmv-timeline-text">{item.text}</div>
            </div>
          </li>
        )}
        {!memories.length && <div className="pmv-empty-text">No memories yet. Start by adding one above!</div>}
      </ul>
    </div>
  );
}

// PUBLIC_INTERFACE
function Photos({ photos, onUpload }) {
  /** Upload and view all photos for the pet */
  const handleUpload = e => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => onUpload(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null; // reset for next upload
    }
  };

  return (
    <div>
      <section className="pmv-section-header">
        <h2 className="pmv-section-title">Photos</h2>
        <label className="pmv-upload-btn">
          Upload Photo
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
        </label>
      </section>
      <div className="pmv-photo-grid">
        {photos.length ?
          photos.map((url, i) => (
            <img className="pmv-photo-img" alt={`pet photo ${i + 1}`} key={i} src={url} />
          )) :
          <div className="pmv-empty-text">No photos yet. Upload one above!</div>
        }
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * AddMilestone: Accepts description, date, and optional photo
 */
function AddMilestone({ onAdd }) {
  const [milestone, setMilestone] = useState('');
  const [date, setDate] = useState('');
  const [milestonePhoto, setMilestonePhoto] = useState(null);

  const handlePhotoChange = e => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setMilestonePhoto(ev.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!milestone || !date) return;
    onAdd({
      text: milestone,
      date: new Date(date).toISOString(),
      photo: milestonePhoto,
      type: "milestone"
    });
    setMilestone('');
    setDate('');
    setMilestonePhoto(null);
  };

  return (
    <form className="pmv-milestone-form" onSubmit={handleSubmit}>
      <input
        className="pmv-input"
        placeholder="Milestone description"
        value={milestone}
        onChange={e => setMilestone(e.target.value)}
        required
      />
      <input
        type="date"
        className="pmv-input"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <label className="pmv-upload-btn pmv-upload-small">
        {milestonePhoto ? "Change Photo" : "Add Photo"}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
      </label>
      {milestonePhoto && (
        <img src={milestonePhoto} alt="Milestone Upload Preview" className="pmv-thumb-preview" />
      )}
      <button className="btn pmv-btn-accent pmv-btn-add-milestone" type="submit">
        Add Milestone
      </button>
    </form>
  );
}

/**
 * PUBLIC_INTERFACE
 * Milestones component - supports photo for each milestone
 */
function Milestones({ milestones, onAddMilestone }) {
  return (
    <div>
      <section className="pmv-section-header">
        <h2 className="pmv-section-title">Milestones</h2>
      </section>
      <AddMilestone onAdd={onAddMilestone} />
      <ul className="pmv-milestone-list">
        {[...milestones].sort((a, b) => new Date(a.date) - new Date(b.date)).map((mile, idx) =>
          <li key={idx} className="pmv-milestone-item">
            <span className="pmv-milestone-date">{new Date(mile.date).toLocaleDateString()}</span>
            <span className="pmv-milestone-text">{mile.text}</span>
            {mile.photo && (
              <img src={mile.photo} alt="Milestone visual" className="pmv-thumb-preview" style={{ marginLeft: 14 }} />
            )}
          </li>
        )}
        {!milestones.length && <div className="pmv-empty-text">No milestones yet. Add one above!</div>}
      </ul>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Scrapbook component: auto-gathers all Memories, Milestones, Photos section; editable descriptions for each element.
 */
function Scrapbook({ photos, milestones, memories, descriptions, setDescriptions, onShare }) {
  // Gather milestone photos and milestones, plus all photos and memories (with text)
  return (
    <div>
      <section className="pmv-section-header">
        <h2 className="pmv-section-title">Scrapbook</h2>
        <button className="pmv-btn-secondary btn pmv-btn-share" onClick={onShare}>Share Scrapbook</button>
      </section>
      <div className="pmv-scrapbook-section">
        <h3 className="pmv-scrapbook-subheading">Milestones</h3>
        {milestones.length ? milestones.map((milestone, idx) => (
          <div key={idx} className="pmv-scrapbook-milestone">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="pmv-milestone-date">{new Date(milestone.date).toLocaleDateString()}</span>
              <span className="pmv-milestone-text">{milestone.text}</span>
              {milestone.photo && (
                <img src={milestone.photo} alt="Milestone" className="pmv-thumb-preview" />
              )}
            </div>
            <textarea
              className="pmv-input pmv-scrapbook-desc"
              placeholder="Add scrapbook notes for this milestone…"
              value={descriptions[`milestone-${idx}`] || ''}
              onChange={e => setDescriptions(desc => ({ ...desc, [`milestone-${idx}`]: e.target.value }))}
              rows={2}
            />
          </div>
        )) : <div className="pmv-empty-text">No milestones added yet.</div>}
      </div>
      <div className="pmv-scrapbook-section">
        <h3 className="pmv-scrapbook-subheading">Memories</h3>
        {memories.length ? [...memories].sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, idx) => (
          <div key={idx} className="pmv-scrapbook-milestone">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span className="pmv-milestone-date">{new Date(item.date).toLocaleString()}</span>
              {item.age && (
                <span className="pmv-milestone-text" style={{ fontWeight: 500, color: "#5a90c8" }}>
                  {item.age} old
                </span>
              )}
              <span className="pmv-milestone-text" style={{ flex: 1 }}>{item.text}</span>
              {item.photo && (
                <img src={item.photo} alt="Memory" className="pmv-thumb-preview" />
              )}
            </div>
            <textarea
              className="pmv-input pmv-scrapbook-desc"
              placeholder="Add notes for this memory…"
              value={descriptions[`memory-${idx}`] || ''}
              onChange={e => setDescriptions(desc => ({ ...desc, [`memory-${idx}`]: e.target.value }))}
              rows={2}
            />
          </div>
        )) : <div className="pmv-empty-text">No memories yet.</div>}
      </div>
      <div className="pmv-scrapbook-section">
        <h3 className="pmv-scrapbook-subheading">All Uploaded Photos</h3>
        <div className="pmv-photo-grid">
          {photos.length ? photos.map((photo, i) => (
            <div key={i} className="pmv-scrapbook-photo-item">
              <img src={photo} alt={`scrapbook pet ${i + 1}`} className="pmv-photo-img" />
              <textarea
                className="pmv-input pmv-scrapbook-desc"
                placeholder="Describe this special moment…"
                value={descriptions[`photo-${i}`] || ''}
                onChange={e => setDescriptions(desc => ({ ...desc, [`photo-${i}`]: e.target.value }))}
                rows={1}
              />
            </div>
          )) : <div className="pmv-empty-text">No photos uploaded yet.</div>}
        </div>
      </div>
      <div className="pmv-scrapbook-buttons">
        <button className="btn pmv-btn-print" onClick={() => window.print()}>Print Scrapbook</button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ShareModal({ isOpen, onClose, url }) {
  /** Simple modal for shareable links */
  if (!isOpen) return null;
  return (
    <div className="pmv-modal-overlay">
      <div className="pmv-modal">
        <h4>Your Shareable Link</h4>
        <input className="pmv-input" value={url} readOnly onClick={(e) => e.target.select()} />
        <button
          className="btn pmv-btn-secondary"
          onClick={() => {
            navigator.clipboard.writeText(url);
            onClose();
          }}>
          Copy to Clipboard & Close
        </button>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Main App container - Home, Timeline, Photos, Milestones, Scrapbook (with navigation)
 */
function App() {
  const [currentSection, setCurrentSection] = useState('Home');
  const [profileImage, setProfileImage] = useState('');
  const [petName, setPetName] = useState('');
  const [memories, setMemories] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [scrapDescriptions, setScrapDescriptions] = useState({});
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Modified: photo uploads from timeline memories and photos page go to photos and scrapbook,
  // and milestones now can have photo as well
  const handleAddMemory = memory => {
    setMemories(m => [memory, ...m]);
    if (memory.photo) setPhotos(p => [memory.photo, ...p]);
  };

  const handleUploadPhoto = photoDataUrl => {
    setPhotos(p => [photoDataUrl, ...p]);
  };

  const handleAddMilestone = milestone => {
    setMilestones(m => [milestone, ...m]);
    if (milestone.photo) setPhotos(p => [milestone.photo, ...p]);
    // This lets all milestone photos show in Scrapbook/Photos automatically.
  };

  const handleShare = () => {
    let path = window.location.origin + "/?story=pet123";
    setShareUrl(path);
    setShareModalOpen(true);
  };

  // Section rendering logic
  let sectionContent;
  if (currentSection === 'Home') {
    sectionContent = (
      <Home
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        petName={petName}
        setPetName={setPetName}
      />
    );
  } else if (currentSection === 'Timeline') {
    sectionContent = (
      <Timeline
        memories={memories}
        onAddMemory={handleAddMemory}
        onShare={handleShare}
      />
    );
  } else if (currentSection === 'Photos') {
    sectionContent = (
      <Photos photos={photos} onUpload={handleUploadPhoto} />
    );
  } else if (currentSection === 'Milestones') {
    sectionContent = (
      <Milestones milestones={milestones} onAddMilestone={handleAddMilestone} />
    );
  } else if (currentSection === 'Scrapbook') {
    sectionContent = (
      <Scrapbook
        photos={photos}
        milestones={milestones}
        memories={memories}
        descriptions={scrapDescriptions}
        setDescriptions={setScrapDescriptions}
        onShare={handleShare}
      />
    );
  }

  return (
    <div className="app pmv-light">
      <Navigation currentSection={currentSection} setCurrentSection={setCurrentSection} />
      <main>
        <div className="container pmv-main-container">
          {sectionContent}
        </div>
      </main>
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} url={shareUrl} />
    </div>
  );
}

export default App;
