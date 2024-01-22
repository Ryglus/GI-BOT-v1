const { Events } = require('discord.js');
const guides = require(modules.Guides);

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.type != 3 || interaction.customId != "guideSelect") return;
        
        try {
            
            var vorakth = guides.loadGuide("Vorkath");
            await interaction.reply({files:[await guides.getHeader("The guide of Vorkath","523567221444968478")],ephemeral:true})
            for (var pages in vorakth) {
                var fullContent = vorakth[pages];

                if (vorakth[pages].content.length > 2000) {
                    var fullContent = vorakth[pages].content;
                    const maxCharCount = 2000;
                    let firstHalf = fullContent.substring(0, maxCharCount); // Get the first 2000 characters

                    // Find the last line break or sentence-ending punctuation in the first half
                    const lastLineBreakIndex = firstHalf.lastIndexOf('\n');
                    const lastSentenceEndIndex = Math.max(
                        firstHalf.lastIndexOf('.'),
                        firstHalf.lastIndexOf('!'),
                        firstHalf.lastIndexOf('?')
                    );

                    if (lastLineBreakIndex > lastSentenceEndIndex) {
                        firstHalf = firstHalf.substring(0, lastLineBreakIndex + 1);
                    } else if (lastSentenceEndIndex >= 0) {
                        firstHalf = firstHalf.substring(0, lastSentenceEndIndex + 1);
                    }

                    const remainingContent = fullContent.substring(firstHalf.length); // Get the remaining content

                    await interaction.followUp({content: firstHalf, ephemeral: true});

                    // Send the remaining content in separate replies
                    const remainingParts = [];
                    let currentPart = '';

                    for (let i = 0; i < remainingContent.length; i++) {
                        currentPart += remainingContent[i];

                        if (currentPart.length >= maxCharCount) {
                            // If the current part exceeds 2000 characters, find the last line break or sentence ending
                            const lastLineBreakIndex = currentPart.lastIndexOf('\n');
                            const lastSentenceEndIndex = Math.max(
                                currentPart.lastIndexOf('.'),
                                currentPart.lastIndexOf('!'),
                                currentPart.lastIndexOf('?')
                            );

                            if (lastLineBreakIndex > lastSentenceEndIndex) {
                                // If there's a line break, split there
                                remainingParts.push(currentPart.substring(0, lastLineBreakIndex + 1));
                                currentPart = currentPart.substring(lastLineBreakIndex + 1);
                            } else if (lastSentenceEndIndex >= 0) {
                                // If there's a sentence ending punctuation, split there
                                remainingParts.push(currentPart.substring(0, lastSentenceEndIndex + 1));
                                currentPart = currentPart.substring(lastSentenceEndIndex + 1);
                            } else {
                                // If neither, just split at the 2000th character
                                remainingParts.push(currentPart.substring(0, maxCharCount));
                                currentPart = currentPart.substring(maxCharCount);
                            }
                        }
                    }

                    // Add the remaining part if any
                    if (currentPart.length > 0) {
                        remainingParts.push(currentPart);
                    }

                    // Send each part as a separate reply
                    for (const part of remainingParts) {
                        if ((remainingParts.indexOf(part)+1)==remainingParts.length) {
                            await interaction.followUp({content: part, files:vorakth[pages].files, ephemeral: true});
                        } else {
                            await interaction.followUp({content: part, ephemeral: true});
                        }
                        
                    }
                } else {
                    // If the content is not too long, send it as a single reply
                    await interaction.followUp(fullContent);
                }
            }


        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    },
};
