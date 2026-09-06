"use client";

import { useQuery } from "@apollo/client/react";
import {
  ADMIN_ANALYTICS_QUERY,
  type AdminAnalyticsQueryData,
} from "../graphql";
import styles from "./analytics-view.module.scss";

export function AnalyticsView() {
  const { data, loading, error } = useQuery<AdminAnalyticsQueryData>(
    ADMIN_ANALYTICS_QUERY,
  );

  if (loading) {
    return <p className={styles.status}>Loading analytics…</p>;
  }
  if (error || !data) {
    return (
      <p className={styles.statusError}>
        Couldn&apos;t load analytics. Please check your connection and try again.
      </p>
    );
  }

  const {
    decksPerCategory,
    topDecksByDownloads,
    topDecksByRating,
    signupsByDay,
    reviewsByDay,
  } = data.adminAnalytics;

  return (
    <div className={styles.grid}>
      <section className={`${styles.panel} index-card`}>
        <h2 className={styles.panelHeading}>Decks per category</h2>
        {decksPerCategory.length === 0 ? (
          <p className={styles.empty}>No public decks yet.</p>
        ) : (
          <table className={styles.table}>
            <tbody>
              {decksPerCategory.map((row) => (
                <tr key={row.categoryName}>
                  <td>{row.categoryName}</td>
                  <td className={styles.numCell}>{row.deckCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={`${styles.panel} index-card`}>
        <h2 className={styles.panelHeading}>Top decks by downloads</h2>
        {topDecksByDownloads.length === 0 ? (
          <p className={styles.empty}>No public decks yet.</p>
        ) : (
          <ol className={styles.rankList}>
            {topDecksByDownloads.map((deck) => (
              <li key={deck.id}>
                <span className={styles.rankTitle}>{deck.title}</span>
                <span className={styles.rankValue}>
                  {deck.downloadsCount}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={`${styles.panel} index-card`}>
        <h2 className={styles.panelHeading}>Top decks by rating</h2>
        {topDecksByRating.length === 0 ? (
          <p className={styles.empty}>No public decks yet.</p>
        ) : (
          <ol className={styles.rankList}>
            {topDecksByRating.map((deck) => (
              <li key={deck.id}>
                <span className={styles.rankTitle}>{deck.title}</span>
                <span className={styles.rankValue}>
                  {deck.ratingCount > 0
                    ? `${deck.ratingAverage.toFixed(1)}★ (${deck.ratingCount})`
                    : "No ratings"}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className={`${styles.panel} index-card`}>
        <h2 className={styles.panelHeading}>Signups, last 30 days</h2>
        <DailyTable rows={signupsByDay} noun="signup" />
      </section>

      <section className={`${styles.panel} index-card`}>
        <h2 className={styles.panelHeading}>Review activity, last 30 days</h2>
        <DailyTable rows={reviewsByDay} noun="card review" />
      </section>
    </div>
  );
}

function DailyTable({
  rows,
  noun,
}: {
  rows: { date: string; count: number }[];
  noun: string;
}) {
  if (rows.length === 0) {
    return <p className={styles.empty}>No {noun}s in this window.</p>;
  }
  return (
    <table className={styles.table}>
      <tbody>
        {rows
          .slice()
          .reverse()
          .map((row) => (
            <tr key={row.date}>
              <td>{row.date}</td>
              <td className={styles.numCell}>{row.count}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
